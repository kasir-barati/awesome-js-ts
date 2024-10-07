import 'reflect-metadata';
import { ConfigType } from './config.type';
import { CONFIG_KEY } from './constants';

export function Config(config: ConfigType) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    return Reflect.defineMetadata(
      CONFIG_KEY,
      config,
      target,
      propertyKey,
    );
  };
}
