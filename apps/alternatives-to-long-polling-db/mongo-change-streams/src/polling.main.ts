import mongoose from 'mongoose';
import { getEnv } from './env.js';
import {
  AuditLogCreateModel,
  AuditLogUpdateModel,
  OrderModel
} from './models/index.js';

/**
 * @summary
 * Cron loop that polls MongoDB via mongoose on a fixed cadence, using `updatedAt` as a watermark to find rows that changed since the last tick. A best-effort polling equivalent of `watch.main.ts`. How this compares to that?
 *
 * - Inserts: covered. A new doc has `createdAt === updatedAt`, so it shows up in the watermark query and we can distinguish it from an update.
 * - Updates: covered, but we do NOT have the "before" value of a order.
 * - Deletes: CANNOT be covered!
 *
 * @description
 * - Deletes: a `find()` cannot see a document that no longer exists. Change streams read the oplog and get every delete for free (with the pre-image if enabled). To detect deletes with polling you'd need one of:
 *   - A `deletedAt` soft-delete column (but then it's not really a delete),
 *   - A full-collection diff every tick against a persisted snapshot (expensive, and still races on create+delete within one interval),
 * - True update pre-images: change streams (with `fullDocumentBeforeChange`/pre-images enabled) give you the document exactly as it was before the update landed in the oplog.
 * - Change streams push events whereas polling waits POLL_INTERVAL_MS and hits the DB every tick even when nothing changed (might still miss an update, might overwhelm your DB).
 */
async function main(): Promise<void> {
  const { mongoUrl, dbName, pollIntervalMs } = getEnv();

  await mongoose.connect(mongoUrl, { dbName });
  console.log('[polling] connected to mongo');

  let busy = false;

  /**
   * @description Watermark: only fetch docs updated strictly after this timestamp.
   */
  let watermark = new Date();

  const tick = async (): Promise<void> => {
    if (busy) {
      // Never overlap ticks. A slow tick shouldn't stack more work.
      return;
    }

    busy = true;
    const startedAt = Date.now();

    let inserts = 0;
    let updates = 0;
    let maxSeen = watermark;

    try {
      const cursor = OrderModel.find({ updatedAt: { $gt: watermark } })
        .sort({ updatedAt: 1 })
        .lean()
        .cursor();

      for await (const order of cursor) {
        const id = String(order._id);
        const isInsert = order.createdAt.getTime() === order.updatedAt.getTime();

        if (isInsert) {
          await AuditLogCreateModel.create({ payload: order });
          console.log(
            `[polling] processed ${order.orderNumber} (age=${Date.now() - order.createdAt.getTime()}ms)`,
          );
          inserts += 1;
        } else {
          await AuditLogUpdateModel.create({
            after: order,
          });
          console.log(
            `[polling] updated ${order.orderNumber} (age=${Date.now() - order.createdAt.getTime()}ms)`,
          );
          updates += 1;
        }

        if (order.updatedAt > maxSeen) {
          maxSeen = order.updatedAt;
        }
      }

      watermark = maxSeen;

      console.log(
        `[polling] tick done in ${Date.now() - startedAt}ms, inserts=${inserts} updates=${updates} watermark=${watermark.toISOString()}`,
      );
    } catch (err) {
      console.error('[polling] tick failed', err);
    } finally {
      busy = false;
    }
  };

  console.log(
    `[polling] starting cron-style loop, interval=${pollIntervalMs}ms`,
  );

  const timer = setInterval(tick, pollIntervalMs);

  void tick(); // Run once immediately so we don't wait a full interval on boot.

  const shutdown = async (): Promise<void> => {
    clearInterval(timer);
    await mongoose.disconnect();
    console.log('[polling] stopped');
    process.exit(0);
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

main().catch((err) => {
  console.error('[polling] fatal', err);
  process.exit(1);
});
