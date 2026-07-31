import { PrismaClient } from '@prisma/client';
import { getEnv } from './env.js';

/**
 * @description Simulates external writes into Postgres via Prisma. Something else (an API, a batch job, a partner integration) is inserting/updating/deleting orders that our worker eventually has to react to.
 */
async function main(): Promise<void> {
  const { databaseUrl, producerIntervalMs } = getEnv();
  const prisma = new PrismaClient({
    datasources: { db: { url: databaseUrl } },
  });

  await prisma.$connect();
  console.log('[producer] connected to postgres via prisma');

  let counter = 0;

  const createTimer = setInterval(async () => {
    counter += 1;
    try {
      const order = await prisma.order.create({
        data: {
          orderNumber: `ORD-${Date.now()}-${counter}`,
          amount: Math.floor(Math.random() * 1000) + 1,
          status: 'new',
        },
      });
      console.log(
        `[producer] inserted order ${order.orderNumber} (id=${order.id.toString()})`,
      );
    } catch (err) {
      console.error('[producer] insert failed', err);
    }
  }, producerIntervalMs);

  const updateTimer = setInterval(async () => {
    try {
      // Advance the oldest 'processing' row to 'processed' first (so the pipeline drains), otherwise pick the oldest 'new' and move it to 'processing'. This gives the polling/wal observers real UPDATE events to react to.
      const processing = await prisma.order.findFirst({
        where: { status: 'processing' },
        orderBy: { createdAt: 'asc' },
      });

      if (processing) {
        const updated = await prisma.order.update({
          where: { id: processing.id },
          data: { status: 'processed', processedAt: new Date() },
        });

        console.log(
          `[producer] updated order ${updated.orderNumber} -> processed (id=${updated.id.toString()})`,
        );

        return;
      }

      const fresh = await prisma.order.findFirst({
        where: { status: 'new' },
        orderBy: { createdAt: 'asc' },
      });

      if (fresh) {
        const updated = await prisma.order.update({
          where: { id: fresh.id },
          data: { status: 'processing' },
        });

        console.log(
          `[producer] updated order ${updated.orderNumber} -> processing (id=${updated.id.toString()})`,
        );
      }
    } catch (err) {
      console.error('[producer] update failed', err);
    }
  }, producerIntervalMs * 2);

  // Seed one 'processed' row so the delete timer has something to chew on right away, matching the mongo demo.
  await prisma.order.create({
    data: {
      orderNumber: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      amount: Math.floor(Math.random() * 1000) + 1,
      status: 'processed',
      processedAt: new Date(),
    },
  });

  const deleteTimer = setInterval(async () => {
    try {
      const doomed = await prisma.order.findFirst({
        where: { status: 'processed' },
        orderBy: { createdAt: 'asc' },
      });
      if (doomed) {
        await prisma.order.delete({ where: { id: doomed.id } });
        console.log(
          `[producer] deleted order ${doomed.orderNumber} (id=${doomed.id.toString()})`,
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
    await prisma.$disconnect();
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
