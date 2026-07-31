import { Prisma, PrismaClient } from '@prisma/client';
import {
  LogicalReplicationService,
  Pgoutput,
  PgoutputPlugin,
} from 'pg-logical-replication';
import { getEnv } from './env.js';

/**
 * @description Subscribe to Postgres's Write-Ahead Log (WAL) via logical replication and react to inserts/updates/deletes the moment they land in the WAL.
 *
 * Architecture note:
 * - Prisma is used for CRUD (setup + writing to `audit_logs`).
 * - `pg-logical-replication` handles the WAL stream itself. Prisma cannot open a raw replication connection (that requires `replication=database` on the pg protocol), so we delegate the streaming part to the driver-level library and keep Prisma for everything else.
 *
 * Under the hood:
 * - Postgres runs with `wal_level=logical` (set in compose.yml).
 * - REPLICA IDENTITY FULL makes UPDATE/DELETE events include the full old row in the WAL — this is the equivalent of Mongo's pre-image support.
 *   - We create a PUBLICATION for the `orders` table.
 *   - We create a logical replication SLOT that persists our position in the WAL. Postgres will retain WAL entries until we acknowledge them, so a crash never means missed events.
 *   - `pgoutput` is Postgres's native logical decoding plugin; we get structured insert/update/delete messages.
 */

async function ensureReplicationObjects(
  prisma: PrismaClient,
  env: ReturnType<typeof getEnv>,
): Promise<void> {
  // REPLICA IDENTITY FULL makes UPDATE/DELETE events include the full old row in the WAL. Without this we only get the primary key columns on delete and no `old` on update.
  await prisma.$executeRawUnsafe(`ALTER TABLE orders REPLICA IDENTITY FULL`);

  const publicationExists = await prisma.$queryRawUnsafe<
    Array<{ exists: boolean }>
  >(
    `SELECT EXISTS (
       SELECT 1 FROM pg_publication WHERE pubname = $1
     ) AS exists`,
    env.publicationName,
  );

  if (!publicationExists[0].exists) {
    await prisma.$executeRawUnsafe(
      `CREATE PUBLICATION ${env.publicationName} FOR TABLE orders`,
    );
    console.log(`[wal] created publication ${env.publicationName}`);
  }

  const slotExists = await prisma.$queryRawUnsafe<Array<{ exists: boolean }>>(
    `SELECT EXISTS (
       SELECT 1 FROM pg_replication_slots WHERE slot_name = $1
     ) AS exists`,
    env.slotName,
  );

  if (!slotExists[0].exists) {
    await prisma.$executeRawUnsafe(
      `SELECT pg_create_logical_replication_slot($1, 'pgoutput')`,
      env.slotName,
    );
    console.log(`[wal] created replication slot ${env.slotName}`);
  }
}

async function main(): Promise<void> {
  const env = getEnv();

  const prisma = new PrismaClient({
    datasources: { db: { url: env.databaseUrl } },
  });
  await prisma.$connect();
  console.log('[wal] connected to postgres via prisma');

  await ensureReplicationObjects(prisma, env);

  // The replication service needs its own connection with the replication protocol enabled — that plumbing lives inside the library.
  const service = new LogicalReplicationService(
    {
      host: env.host,
      port: env.port,
      user: env.user,
      password: env.password,
      database: env.database,
    },
    {
      acknowledge: { auto: true, timeoutSeconds: 10 },
    },
  );

  const plugin = new PgoutputPlugin({
    protoVersion: 2,
    publicationNames: [env.publicationName],
  });

  service.on('data', async (_lsn: string, msg: Pgoutput.Message) => {
    if (msg.tag !== 'insert' && msg.tag !== 'update' && msg.tag !== 'delete') {
      return;
    }
    if (msg.relation.name !== 'orders') {
      return;
    }

    if (msg.tag === 'insert') {
      const row = msg.new;
      await prisma.auditLog.create({
        data: {
          eventType: 'create',
          payload: normalize(row),
        },
      });
      console.log(
        `[wal] processed ${row.order_number} (age=${Date.now() - toDate(row.created_at).getTime()
        }ms)`,
      );

      return;
    }

    if (msg.tag === 'update') {
      const after = msg.new;
      const before = msg.old ?? msg.key ?? { id: after.id };

      await prisma.auditLog.create({
        data: {
          eventType: 'update',
          before: normalize(before),
          after: normalize(after),
        },
      });
      console.log(
        `[wal] updated ${after.order_number} (age=${Date.now() - toDate(after.created_at).getTime()
        }ms)`,
      );

      return;
    }

    if (msg.tag === 'delete') {
      const row = msg.old ?? msg.key;

      await prisma.auditLog.create({
        data: {
          eventType: 'delete',
          payload: row ? normalize(row) : Prisma.JsonNull,
        },
      });

      if (!row || !row.order_number) {
        console.log(
          `[wal] deleted row (pre-image unavailable — is REPLICA IDENTITY FULL set?)`,
        );

        return;
      }

      console.log(
        `[wal] deleted ${row.order_number} (age=${Date.now() - toDate(row.created_at).getTime()
        }ms)`,
      );

      return;
    }
  });

  service.on('error', (err: Error) => {
    console.error('[wal] service error', err);
  });

  service.on('heartbeat', (lsn, _ts, shouldRespond) => {
    if (shouldRespond) {
      void service.acknowledge(lsn);
    }
  });

  console.log(
    `[wal] subscribing to slot="${env.slotName}" publication="${env.publicationName}"`,
  );

  const runLoop = (): void => {
    service
      .subscribe(plugin, env.slotName)
      .catch((err) => {
        console.error('[wal] subscribe failed, retrying in 1s', err);
      })
      .then(() => {
        if (!service.isStop()) {
          setTimeout(runLoop, 1000);
        }
      });
  };
  runLoop();

  const shutdown = async (): Promise<void> => {
    await service.stop();
    await prisma.$disconnect();
    console.log('[wal] stopped');
    process.exit(0);
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

/**
 * pgoutput row values are already parsed to native JS types (Date, number, string, ...). We need to make the payload JSON-safe before storing it in a JSONB column: BigInt is not valid JSON, and Date should be serialized as an ISO string.
 */
function normalize(row: Record<string, unknown>): Prisma.InputJsonValue {
  return JSON.parse(
    JSON.stringify(row, (_key, v) => {
      if (typeof v === 'bigint') {
        return v.toString();
      }
      if (v instanceof Date) {
        return v.toISOString();
      }

      return v;
    }),
  );
}

function toDate(value: unknown): Date {
  if (value instanceof Date) {
    return value;
  }

  if (typeof value === 'string' || typeof value === 'number') {
    return new Date(value);
  }

  return new Date();
}

main().catch((err) => {
  console.error('[wal] fatal', err);
  process.exit(1);
});
