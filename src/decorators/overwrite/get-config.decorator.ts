import 'reflect-metadata';
import { CONFIG_KEY } from './constants';

export function getConfig(target: any, propertyKey: string) {
  return Reflect.getMetadata(CONFIG_KEY, target, propertyKey);
}
