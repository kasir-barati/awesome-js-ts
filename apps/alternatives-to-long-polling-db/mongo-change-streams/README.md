## What's inside

Three tiny NodeJS processes talking to a single-node MongoDB replica set (change streams require a replica set):

| Service    | File                       | What it does                                                            |
| ---------- | -------------------------- | ----------------------------------------------------------------------- |
| `producer` | `src/producer.main.ts`     | Creates, updates, and deletes orders to simulate external traffic.      |
| `polling`  | `src/polling.main.ts`      | The **old** way: `setInterval`.                                         |
| `watch`    | `src/watch.main.ts`        | The **new** way: `OrderModel.watch()` reacts to events instantly.       |

To see the contrast cleanly, run them one at a time (comment the other out in [`compose.yml`](./compose.yml)), or bump `POLL_INTERVAL_MS` to something big like `30000`.

## Run

```bash
cd apps/alternatives-to-long-polling-db/mongo-change-streams
docker compose up --build -d
```

Then watch the logs for `mcs-polling` vs `mcs-watch` and compare the `age=` numbers.

## Why change streams beat polling

- **Latency**: bounded by the network, not by your cron cadence.
- **DB load**: MongoDB pushes events from the oplog; idle time = zero queries.
- **Resumability**: every event carries a resume token. Persist it and you can restart the worker without missing anything and without a full re-scan.
- **Filtering server-side**: `watch([{ $match: ... }])` — MongoDB only sends you the events you care about.
