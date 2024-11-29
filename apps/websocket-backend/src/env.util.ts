import { config } from 'dotenv';
import { join } from 'path';

export function loadEnv() {
  config({
    path: join(__dirname, '..', '.env'),
  });
}

export function getEnv() {
  loadEnv();

  const envs = {
    port: Number(process.env.PORT),
    databaseUrl: process.env.DATABASE_URL,
    dbName: process.env.MONGO_INITDB_DATABASE,
    openaiApiKey: process.env.OPENAI_API_KEY,
  };

  for (const env of Object.values(envs)) {
    if (!env) {
      throw 'UndefinedEnv';
    }
  }

  return envs;
}
