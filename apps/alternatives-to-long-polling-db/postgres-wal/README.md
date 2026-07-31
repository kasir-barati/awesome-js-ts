## What's inside

Three tiny NodeJS processes talking to a single Postgres 16 instance configured with `wal_level=logical`:

| Service    | File                   | What it does                                                                      |
| ---------- | ---------------------- | --------------------------------------------------------------------------------- |
| `producer` | `src/producer.main.ts` | Creates, updates, and deletes orders to simulate external traffic.                |
| `polling`  | `src/polling.main.ts`  | The **old** way: `setInterval` with an `updatedAt` watermark.                     |
| `wal`      | `src/wal.main.ts`      | The **new** way: `pgoutput` logical decoding streamed to Node — reacts instantly. |

To see the contrast cleanly, run them one at a time (comment the other out in [`compose.yml`](./compose.yml)), or bump `POLL_INTERVAL_MS` to something big like `30000`. Both observers write to an `audit_logs` table (single-table inheritance via an `event_type` discriminator column, mirroring the sibling `mongo-change-streams` demo).

## Run

```bash
cd apps/alternatives-to-long-polling-db/postgres-wal
docker compose up --build -d
```

Then watch the logs for `pgwal-polling` vs `pgwal-wal` and compare the `age=` numbers.

## How the WAL consumer works

1. Runs `ALTER TABLE orders REPLICA IDENTITY FULL` so UPDATE/DELETE events include the full old row.
2. Creates a `PUBLICATION` for the `orders` table (on first boot).
3. Creates a durable logical replication `SLOT` (on first boot).
4. Streams row-level inserts / updates / deletes from the WAL and writes an `audit_logs` row for each.

## Why Prisma + a driver library?

Prisma is used everywhere it can be — schema, CRUD, raw SQL for publication/slot bootstrap, writing to `audit_logs`.

But **Prisma cannot open a replication connection**: a logical replication stream needs a raw pg connection with `replication=database` set at protocol level, which the Prisma engine does not expose. So the WAL stream itself is handled by the driver-level `pg-logical-replication` library, which internally uses `node-postgres` in replication mode. Prisma still owns every non-streaming interaction.

## Why WAL beats polling

- **Latency**: a few ms after COMMIT, versus up to a full poll interval.
- **DB load**: no queries when nothing happens. Postgres streams changes to the connected replication client.
- **Durability**: the replication slot pins the WAL until you acknowledge — restart the consumer and it resumes exactly where it left off. No missed events, no full-table re-scans.
- **Deletes are visible**: a `SELECT` cannot see a row that no longer exists. The WAL sees every DELETE (with the pre-image thanks to REPLICA IDENTITY FULL).
- **Update pre-images**: the WAL gives you the row exactly as it was before the update. Polling only ever sees the "after".

> [!IMPORTANT]
>
> - The demo runs everything as the `demo` superuser. In production use a role with just `REPLICATION` + `SELECT` on the target tables.
> - `db push` is used for demo simplicity. For real workloads use `prisma migrate` and put `REPLICA IDENTITY` / `PUBLICATION` DDL into a proper migration.
