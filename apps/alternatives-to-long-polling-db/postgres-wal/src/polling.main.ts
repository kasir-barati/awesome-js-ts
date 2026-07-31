import { Prisma, PrismaClient } from '@prisma/client';
import { getEnv } from './env.js';

/**
 * @summary
 *
 * Cron loop that polls Postgres via Prisma on a fixed cadence, using `updatedAt` as a watermark to find records that changed since the last tick. A best-effort polling equivalent of `wal.main.ts`. How this compares to that?
 *
 * - Inserts: covered. A new row has `createdAt === updatedAt`, so it shows up in the watermark query and we can distinguish it from an update.
 * - Updates: covered, but we do NOT have the "before" value of an order.
 * - Deletes: CANNOT be covered!
 *
 * @description
 * - Deletes: a `findMany()` cannot see a row that no longer exists. The WAL consumer reads logical replication messages and gets every DELETE for free (with the full old row when REPLICA IDENTITY FULL is set). To detect deletes with polling you'd need one of:
 *   - A `deletedAt` soft-delete column (but then it's not really a delete),
 *   - A full-table diff every tick against a persisted snapshot (expensive, and still races on create+delete within one interval),
 * - True update pre-images: logical decoding with REPLICA IDENTITY FULL gives you the row exactly as it was before the update was committed.
 * - The WAL pushes events whereas polling waits POLL_INTERVAL_MS and hits the DB every tick even when nothing changed (might still miss an update, might overwhelm your DB).
 */
async function main(): Promise<void> {
  const { databaseUrl, pollIntervalMs } = getEnv();
  const prisma = new PrismaClient({
    datasources: { db: { url: databaseUrl } },
  });

  await prisma.$connect();
  console.log('[polling] connected to postgres via prisma');

  let busy = false;
  /**
   * @description Watermark: only fetch records updated strictly after this timestamp.
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
      const records = await prisma.order.findMany({
        where: { updatedAt: { gt: watermark } },
        orderBy: { updatedAt: 'asc' },
      });

      for (const order of records) {
        const isInsert =
          order.createdAt.getTime() === order.updatedAt.getTime();

        if (isInsert) {
          await prisma.auditLog.create({
            data: {
              eventType: 'create',
              payload: serialize(order),
            },
          });
          console.log(
            `[polling] processed ${order.orderNumber} (age=${Date.now() - order.createdAt.getTime()}ms)`,
          );
          inserts += 1;
        } else {
          await prisma.auditLog.create({
            data: {
              eventType: 'update',
              after: serialize(order),
            },
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
    await prisma.$disconnect();
    console.log('[polling] stopped');
    process.exit(0);
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

/**
 * @description `JSON.stringify` chokes on `BigInt`. Prisma's `Order.id` is a BigInt, so we normalize the payload before writing it into the JSONB audit_logs column.
 */
function serialize<T>(value: T): Prisma.InputJsonValue {
  return JSON.parse(
    JSON.stringify(value, (_key, v) =>
      typeof v === 'bigint' ? v.toString() : v,
    ),
  );
}

main().catch((err) => {
  console.error('[polling] fatal', err);
  process.exit(1);
});
