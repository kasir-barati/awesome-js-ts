# Alternatives to Long Polling DB

Instead of a **cron-based long-polling** worker with a **push-based**.

## [MongoDB: Change Stream](./mongo-change-streams/README.md)

[Change stream](https://www.mongodb.com/docs/manual/changeStreams/) (`Model.watch(...)`), using [mongoose](https://mongoosejs.com/).

## [Postgres: Write-Ahead Log](./postgres-wal/README.md)

**Push-based** consumer that subscribes to Postgres's Write-Ahead Log via [logical replication](https://www.postgresql.org/docs/current/logical-replication.html). Using [Prisma](https://www.prisma.io/) and the WAL stream itself is consumed via [`pg-logical-replication`](https://github.com/kibae/pg-logical-replication).

> [!TIP]
>
> - The Postgres container needs to be configured with `wal_level=logical` and raised `max_wal_senders`/`max_replication_slots` via the `command` block in `docker-compose.yml`.
> - A **replication slot retains WAL** until acknowledged. If the consumer is offline for a long time, Postgres disk usage grows. Monitor `pg_replication_slots`.
