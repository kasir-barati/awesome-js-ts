# Closure

- The combination of a function and the [lexical](#lexical) environment within which that a function was declared.
- Gives you access to an outer function's scope from an inner function.
- Created every time a function is created, at function creation time.
- Do not create functions within functions:
  - Since each function instance manages its own scope and closure.

![Stateful app thanks to closure](./stateful.png)

# Glossary

<dl>
  <dt id="lexical">Lexical</dt>
  <dd>
    Relating to the words or vocabulary of a language.
  </dd>
  <dd>
    How scoping occurs in the JavaScript language. Lexical scoping uses the location of where a variable is declared in the source code to determine where the variable is available in the source code.
  </dd>
</dl>

# Learn more

- [How React Uses Closures to Avoid Bugs](https://www.epicreact.dev/how-react-uses-closures-to-avoid-bugs)
