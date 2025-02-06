export function ArgumentLogger(
  target: any,
  methodName: string,
  descriptor: PropertyDescriptor,
) {
  const originalMethod = descriptor.value;

  descriptor.value = function (...args: any[]) {
    console.log('arguments of ' + methodName + 'are: ');
    console.log(args);

    // Invoke the method itself
    return originalMethod.apply(this, args);
  };

  return descriptor;
}

class Calc {
  @ArgumentLogger
  add(a: number, b: number) {
    return a + b;
  }
}
