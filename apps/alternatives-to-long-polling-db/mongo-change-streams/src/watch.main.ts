import type {
  ChangeStream,
  ChangeStreamDocument,
  ResumeToken,
} from 'mongodb';
import mongoose from 'mongoose';
import { getEnv } from './env.js';
import {
  AuditLogCreateModel,
  AuditLogDeleteModel,
  AuditLogUpdateModel,
  Order,
  OrderModel,
} from './models/index.js';

/**
 * @description Subscribe to MongoDB change streams via `Model.watch(...)` and react to  the moment they land in the oplog.
 *
 * Benefits:
 *
 * - Near-zero latency vs. the poll interval.
 * - Zero DB pressure when nothing changes; MongoDB pushes events.
 * - Resume tokens let us pick up exactly where we left off after a crash / redeploy — no missed events, no re-scans of the whole collection.
 *
 * Requires the MongoDB server to run as a replica set (or a sharded cluster). See docker-compose.yml — we run a 1-node replica set.
 */
async function main(): Promise<void> {
  const { mongoUrl, dbName } = getEnv();
  const watchedOperations = ['insert', 'update', 'delete'];

  await mongoose.connect(mongoUrl, { dbName });
  console.log('[watch] connected to mongo');

  /**
   * Something!
   * @description In a real system, persist this to disk/DB so we can resume after a restart without missing events. For the demo we hold it in memory.
   */
  let resumeAfter: ResumeToken | undefined;

  const startStream = (): ChangeStream<Order> => {
    const stream = OrderModel.watch<Order>(
      [{ $match: { operationType: { $in: watchedOperations } } }],
      {
        fullDocument: 'updateLookup',
        resumeAfter,
      },
    ) as unknown as ChangeStream<Order>;

    stream.on('change', async (event: ChangeStreamDocument<Order>) => {
      resumeAfter = event._id;

      if (event.operationType === 'insert') {
        const order = event.fullDocument;

        if (!order) {
          return;
        }

        await AuditLogCreateModel.create({
          payload: order,
        });
        console.log(
          `[watch] processed ${order.orderNumber} (age=${Date.now() - new Date(order.createdAt).getTime()
          }ms)`,
        );

        return;
      }

      if (event.operationType === 'update') {
        const order = event.fullDocument;

        if (!order) {
          return;
        }

        await AuditLogUpdateModel.create({
          before: event.fullDocumentBeforeChange ?? { _id: event.documentKey._id },
          after: order,
        });

        console.log(
          `[watch] updated ${order.orderNumber} (age=${Date.now() - new Date(order.createdAt).getTime()
          }ms)`,
        );

        return;
      }

      if (event.operationType === 'delete') {
        const order = event.fullDocumentBeforeChange;

        await AuditLogDeleteModel.create({
          payload: order ?? { _id: event.documentKey._id },
        });

        if (!order) {
          console.log(`[watch] deleted ${String(event.documentKey._id)} (pre-image unavailable)`);

          return;
        }

        console.log(
          `[watch] deleted ${order.orderNumber} (age=${Date.now() - new Date(order.createdAt).getTime()
          }ms)`,
        );

        return;
      }
    });

    stream.on('error', (err) => {
      console.error('[watch] stream error, will restart', err);
      stream.close().catch(() => undefined);
      setTimeout(() => {
        activeStream = startStream();
      }, 1000);
    });

    return stream;
  };

  let activeStream = startStream();
  console.log('[watch] subscribed to change stream, waiting for events...');

  const shutdown = async (): Promise<void> => {
    await activeStream.close();
    await mongoose.disconnect();
    console.log('[watch] stopped');
    process.exit(0);
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

main().catch((err) => {
  console.error('[watch] fatal', err);
  process.exit(1);
});
