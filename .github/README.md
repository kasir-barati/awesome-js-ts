# Awesome JS/TS

Here I would share with you all sort of awesome things about TS/JS. E.g. Regex, closure, etc

> [!CAUTION]
>
> Keep the [docs](#docs) section in sync with [`index.md`](../index.md).

# How to test it:

1. `npm ci` or `pnpm i --frozen-lockfile`
2. **Optional**: Install 3rd party libs necessary for Cypress `pacman -S gtk2 gtk3 alsa-lib xorg-server-xvfb libxss nss libnotify`.
3. To run:
   1. Unit tests: `pnpm run test:watch`.
   2. E2E tests: `pnpm run cy:open`.

## Docs

- [What is testing all about?](../docs/testing.md)
- [Cypress](../cypress/README.md)
- [Regex](../src/regex/README.md)
- [RabbitMQ](../docs/rabbitmq.md).
  - [Examples are here](../src/rabbitmq/).
- [Decorators in TS](../src/decorators/README.md).
