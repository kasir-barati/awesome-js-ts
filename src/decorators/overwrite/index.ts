import { Config } from './config.decorator';
import { getConfig } from './get-config.decorator';

class A {
  @Config({ f1: '1', f2: 1 })
  @Config({ f1: '2', f2: 2 })
  @Config({ f1: '3', f2: 3 })
  methodB() {
    const conf = getConfig(this, 'methodB');

    console.log(conf);
  }
}

const a = new A();
a.methodB();
