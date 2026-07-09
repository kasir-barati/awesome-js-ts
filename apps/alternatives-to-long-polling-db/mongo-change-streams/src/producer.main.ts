import mongoose from 'mongoose';
import { getEnv } from './env.js';
import { OrderModel } from './models/order.model.js';

/**
 * @description Simulates external writes into MongoDB via mongoose. Something else (an API, a batch job, a partner integration) is inserting new orders that our worker eventually has to react to.
 */
async function main(): Promise<void> {
  const { mongoUrl, dbName, producerIntervalMs } = getEnv();

  await mongoose.connect(mongoUrl, { dbName });
  console.log('[producer] connected to mongo');

  let counter = 0;

  const createTimer = setInterval(async () => {
    counter += 1;
    try {
      const doc = await OrderModel.create({
        orderNumber: `ORD-${Date.now()}-${counter}`,
        amount: Math.floor(Math.random() * 1000) + 1,
        status: 'new',
      });
      console.log(
        `[producer] inserted order ${doc.orderNumber} (_id=${doc._id.toString()})`,
      );
    } catch (err) {
      console.error('[producer] insert failed', err);
    }
  }, producerIntervalMs);
  const updateTimer = setInterval(async () => {
    try {
      const doc = await OrderModel.findOneAndUpdate(
        { status: 'processing' },
        { $set: { status: 'processed', processedAt: new Date() } },
        { sort: { createdAt: 1 }, new: true },
      );
      if (doc) {
        console.log(
          `[producer] updated order ${doc.orderNumber} (_id=${doc._id.toString()})`,
        );
      }
    } catch (err) {
      console.error('[producer] update failed', err);
    }
  }, producerIntervalMs * 2);

  await OrderModel.create({
    orderNumber: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    amount: Math.floor(Math.random() * 1000) + 1,
    status: 'processed',
  });

  const deleteTimer = setInterval(async () => {
    try {
      const doc = await OrderModel.findOneAndDelete(
        { status: 'processed' },
        { sort: { createdAt: 1 } },
      );
      if (doc) {
        console.log(
          `[producer] deleted order ${doc.orderNumber} (_id=${doc._id.toString()})`,
        );
      }
    } catch (err) {
      console.error('[producer] delete failed', err);
    }
  }, producerIntervalMs * 3);

  const shutdown = async (): Promise<void> => {
    clearInterval(createTimer);
    clearInterval(updateTimer);
    clearInterval(deleteTimer);
    await mongoose.disconnect();
    console.log('[producer] stopped');
    process.exit(0);
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

main().catch((err) => {
  console.error('[producer] fatal', err);
  process.exit(1);
});
