#!/bin/sh
set -e

# Push the Prisma schema on every container start. It's idempotent: if the schema is already in place, `db push` is a no-op. Only one of the three services actually needs to do this, but running it in each is safe and avoids ordering headaches.

if [ -n "$DATABASE_URL" ]; then
  echo "[entrypoint] running prisma db push"
  npx prisma db push --skip-generate --accept-data-loss # `--accept-data-loss` is fine for this demo (no real data), and lets `db push` proceed on non-empty databases without prompting.
fi

exec "$@"
