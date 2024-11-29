import { config } from 'dotenv';
import { join } from 'path';
import { Sender } from './sender';
import { Receiver } from './receiver';

config({
  path: join(process.cwd(), '.env'),
});

const receiver = new Receiver();
const sender = new Sender();

process.on('beforeExit', async () => {
  await receiver.cleanup();
});

(async () => {
  await receiver.init();
  await sender.init();

  setTimeout(() => {
    process.exit(0);
  }, 5_000);
})().catch(console.error);
