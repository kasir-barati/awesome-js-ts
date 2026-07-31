export interface Env {
  databaseUrl: string;
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  publicationName: string;
  slotName: string;
  pollIntervalMs: number;
  producerIntervalMs: number;
}

export function getEnv(): Env {
  const host = process.env.PG_HOST ?? 'postgres';
  const port = Number(process.env.PG_PORT ?? 5432);
  const user = process.env.PG_USER ?? 'demo';
  const password = process.env.PG_PASSWORD ?? 'demo';
  const database = process.env.PG_DATABASE ?? 'demo';
  const databaseUrl =
    process.env.DATABASE_URL ??
    `postgresql://${user}:${password}@${host}:${port}/${database}`;

  return {
    databaseUrl,
    host,
    port,
    user,
    password,
    database,
    publicationName: process.env.PG_PUBLICATION ?? 'orders_pub',
    slotName: process.env.PG_SLOT ?? 'orders_slot',
    pollIntervalMs: Number(process.env.POLL_INTERVAL_MS ?? 5000),
    producerIntervalMs: Number(process.env.PRODUCER_INTERVAL_MS ?? 3000),
  };
}
