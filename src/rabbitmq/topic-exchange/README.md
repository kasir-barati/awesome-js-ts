# How to start

1. `pnpm install`.
2. `cp src/rabbitmq/topic-exchange/.env.example src/rabbitmq/topic-exchange/.env`.
3. `cd src/rabbitmq/topic-exchange`.
4. `docker compose up -d`.
5. `npx ts-node index.ts`.

## Result

Multiple routing keys will be bound to one queue:

![Screenshot of multi binding in RabbitMQ management console](./multi-binding.png)
