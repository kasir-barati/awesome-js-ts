# Cypress folder structure

- `.gitignore`:
  - `cypress/downloads`: downloaded files.
  - `cypress.env.json` if you're storing sensitive data in it.
  - [Asset files](https://docs.cypress.io/guides/core-concepts/writing-and-organizing-tests#Asset-Files): auto generated files when tests were executed.
  - `cypress/screenshots` and `cypress/videos`:
    - Videos recorded of the run.
    - Screenshots were taken via the `cy.screenshot()` command or automatically when a test fails.
- Spec files:
  - Test files.
  - Located in`cypress/e2e` by default.
- Fixture files:
  - External static data that can be used by your tests.
  - Located in `cypress/fixtures` by default.
  - Use them with the `cy.fixture()` command.
- Support files:
  - Runs **before every single spec file**.
  - [Default path](https://docs.cypress.io/guides/core-concepts/writing-and-organizing-tests#Support-file): `cypress/support/e2e.{js,jsx,ts,tsx}`
  - Great for defining custom commands or global overrides.

# General rules for writing tests in Cypress

- Tests written in Cypress always happen **serially**.

  - Not parallel.
  - Integration & e2e tests primarily mimic the actions of a real user, Cypress models its command execution model after **a real user working step by step**.

- Isolation: Tests should always be able to be run independently from one another and still pass.

- [KISS](https://en.wikipedia.org/wiki/KISS_principle): simple yet covers a lot of ground both in frontend and backend.

  ```ts
  describe('Post Resource', () => {
    it('Creating a New Post', () => {
      cy.visit('/posts/new'); // 1.

      cy.get('input.post-title') // 2.
        .type('My First Post'); // 3.

      cy.get('input.post-body') // 4.
        .type('Hello, world!'); // 5.

      cy.contains('Submit') // 6.
        .click(); // 7.

      cy.get('h1') // 8.
        .should('contain', 'My First Post');
    });
  });
  ```

- 3 general phase for a test ("Given, When, Then", or "Arrange, Act, Assert"):

  1. Set up the application state.
  2. Take an action.
  3. Make an assertion about the `resulting application state.

- The rule of thumb for chaining: If you **perform an action**, **end the chain of commands there** and start fresh from `cy`.

  - Actions can be navigating the page, clicking a button or scrolling the viewport.

- Cypress commands are asynchronous (**NOT JS promises**).

  ```ts
  it('hides the thing when it is clicked', () => {
    cy.visit('/my/resource/path'); // Nothing happens yet
    cy.get('.hides-when-clicked') // Still nothing happening
      .should('not.be.visible'); // Definitely nothing happening yet
  });
  // Ok, the test function has finished executing...
  // We've queued all of these commands and now
  // Cypress will begin running them in order!
  ```

  [Learn more how sync and async in cypress might cause headache for you](https://docs.cypress.io/guides/core-concepts/introduction-to-cypress#Mixing-Async-and-Sync-code).

- |         | BDD                     | TDD             |
  | ------- | ----------------------- | --------------- |
  | Command | `expect`/`should`/`and` | `assert`        |
  | Type    | E2E tests               | Component tests |

- What is watched? `cypress.env.json`, `cypress.config.ts`, `cypress/e2e/`, `cypress/support/`
  - Disable it: `watchForFileChanges: false` in the `cypress.config.ts`.
- What is **NOT** watched? Your application code, `node_modules`, `cypress/fixtures/`

# Cypress commands

- Read the doc [here](https://docs.cypress.io/api/table-of-contents).

# Querying Elements

- Same syntax as jQuery.
- Retries to find the element in DOM, util it reaches its timeout.
  - The [default `timeout` value](https://docs.cypress.io/guides/core-concepts/introduction-to-cypress#Default-Values) is 4 seconds for **most** commands.
    - **You don't want to make it "extra long, just in case".**
    - The `timeout` parameter always goes inside the command.
    ```ts
    // DOES NOT WORK
    cy.get('.selector').should('be.visible', { timeout: 1000 });
    // THE CORRECT WAY
    cy.get('.selector', { timeout: 1000 }).should('be.visible');
    ```
  - Use `Cypress.$` if you wanna skip this builtin functionality.

## `cy.contains()`

- Look elements up by their content.
- E.g. `cy.get('main').contains('New Post')` finds an element within `main` element containing the text 'New Post'.
- In case you're app is multilingual.

# Assertion

- Commands that enable you to describe the desired state of your application.
  - Ensure your element has a specific attribute.
  ```ts
  cy.get(':checkbox').should('be.disabled');
  cy.get('form').should('have.class', 'form-horizontal');
  cy.get('input').should('not.have.value', 'US');
  ```
- Cypress waits for the element to reach that state, no need to know when the element will be in that state.
- No need to write explicit assertions always:
  ```ts
  cy.visit('/home');
  cy.get('.main-menu').contains('New Project').click();
  cy.get('.title').type('My Awesome Project');
  cy.get('form').submit();
  ```
  This is because many commands have [built-in Implicit](https://docs.cypress.io/guides/core-concepts/introduction-to-cypress#For-instance) Assertions which offer you a high level of confidence that your application is working as expected.
- `.and` is the same as `.should`. Added for readability sake:
  ```ts
  cy.get('#header a')
    .should('have.class', 'active')
    .and('have.attr', 'href', '/users');
  ```
- **Idempotency**: when you've passed a callback to `.should` it should be idempotent. Remember, Cypress retries a should multiple times in case of failure. So if your code has side-effects then your test won't be deterministic and reliable.
