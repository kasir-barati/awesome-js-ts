import { config } from 'dotenv';
import { join } from 'path';
import { Sender } from './sender';
import { UserReceiver } from './user-receiver';
import { LoggerReceiver } from './logger-receiver';

config({
  path: join(process.cwd(), '.env'),
});

const sender = new Sender();
const userReceiver = new UserReceiver();
const loggerReceiver = new LoggerReceiver();

process.on('beforeExit', async () => {
  await userReceiver.cleanup();
  await loggerReceiver.cleanup();
});

(async () => {
  await userReceiver.init();
  await loggerReceiver.init();
  await sender.init();

  setTimeout(() => {
    process.exit(0);
  }, 5_000);
})().catch(console.error);
