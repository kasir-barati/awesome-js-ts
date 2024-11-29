import { getEnv } from './env.util';

const { port, frontendUrl } = getEnv();
const whitelist = [
  `http://127.0.0.1:${port}`,
  `http://localhost:${port}`,
  frontendUrl,
];

export function isNotWhitelisted(origin: string) {
  return whitelist.indexOf(origin) === -1;
}
