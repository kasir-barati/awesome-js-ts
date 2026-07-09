export interface Env {
  mongoUrl: string;
  dbName: string;
  collectionName: string;
  pollIntervalMs: number;
  producerIntervalMs: number;
}

export function getEnv(): Env {
  const mongoUrl =
    process.env.MONGO_URL ??
    'mongodb://mongo:27017/?replicaSet=rs0&directConnection=true';
  const dbName = process.env.MONGO_DB_NAME ?? 'demo';
  const collectionName = process.env.MONGO_COLLECTION ?? 'orders';
  const pollIntervalMs = Number(process.env.POLL_INTERVAL_MS ?? 5000);
  const producerIntervalMs = Number(
    process.env.PRODUCER_INTERVAL_MS ?? 3000,
  );

  return {
    mongoUrl,
    dbName,
    collectionName,
    pollIntervalMs,
    producerIntervalMs,
  };
}
