# Overload

## Function Overloading

In this particular case I was trying to have a param with default values and a callback as the ;last param:

```ts
import { PassThrough } from "stream";

type Callback = (mergedData: Buffer<ArrayBuffer>) => unknown;

function chunkCollector(passthrough: PassThrough, chunkSizeLimit: number): void;
function chunkCollector(passthrough: PassThrough, callback: Callback): void;
function chunkCollector(passthrough: PassThrough, chunkSizeLimit: number, callback: Callback): void;
function chunkCollector(passthrough: PassThrough, arg2: Callback | number, arg3?: Callback): void {
  const collectedChunks: Uint8Array[] = [];
  const chunkSizeLimit = typeof arg2 === "number" ? arg2 : 5 * 1024 * 1024;
  const callback =
    typeof arg2 === "function" ? arg2 : arg3 !== undefined ? arg3 : () => {};
  // ...
}
```
