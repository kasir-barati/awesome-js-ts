# How to start

1. `pnpm install`.
2. `cp src/rabbitmq/headers-exchange/.env.example src/rabbitmq/headers-exchange/.env`
3. `docker compose up -d`
4. `npx ts-node src/rabbitmq/headers-exchange/index.ts`
