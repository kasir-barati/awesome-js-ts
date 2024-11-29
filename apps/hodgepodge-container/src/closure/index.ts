export function lexicalScoping() {
  // Variables declared with var are either function-scoped or global-scoped.
  // This variable is accessible only within the function body where it's declared.
  var name = 'Mozilla';
  function displayName() {
    // displayName() is the inner function, that forms the closure
    console.log(name); // use variable declared in the parent function
  }
  displayName();
}

export function curlyBracesDoNotCreateScope() {
  if (Math.random() > 0.5) {
    var x = 1;
  } else {
    var x = 2;
  }

  console.log(x);
}

export function curlyBracesCreateScope() {
  if (Math.random() > 0.5) {
    const x = 1;
  } else {
    const x = 2;
  }
  // console.log(x); // Cannot find name 'x'.ts(2304)
}

export function lexicalScopingFactory() {
  // In other programming languages local variables within a function exist for just the duration of that function's execution.
  // But functions in JS form closures.
  // The instance of displayName maintains a reference to its lexical environment, within which the variable name exists.
  const name = 'Mozilla';
  function displayName() {
    console.log(name);
  }
  return displayName;
}

export function addFactory(x: number) {
  return function (y: number) {
    return x + y;
  };
}
