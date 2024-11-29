import { isNotWhitelisted } from './is-not-whitelisted.util';

export function origin(
  origin?: string,
  callback?: (err: Error | null, origin?: string | boolean) => void,
) {
  if (origin && isNotWhitelisted(origin)) {
    callback(new Error('CorsError'));
    return;
  }
  callback(null, true);
}
