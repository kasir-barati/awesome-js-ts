export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      RABBITMQ_URI: string;
    }
  }
}
