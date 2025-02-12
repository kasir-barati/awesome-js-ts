# RxJS

- Reactive Extensions Library for JavaScript.

## `mergeMap` and `catchError`

- When an error occurs, the `catchError` operator will return a new observable that will be subscribed to.
  - This means that the **entire pipeline** will be retried!

<table>
<thead><tr><th>Code</th><th>Logs</th></tr></thead>
<tbody>
<tr><td>

```ts
import { randomUUID } from 'crypto';
import { catchError, mergeMap, Observable } from 'rxjs';

const observable = new Observable<number>((subscriber) => {
  subscriber.next(1);
});

observable
  .pipe(
    mergeMap((data: number) => addTo(data)),
    catchError((error, caught$) => {
      console.log('First', error);
      return caught$;
    }),
    mergeMap((data: number) => uuidGen(data)),
    catchError((error, caught$) => {
      console.log('Second', error);
      return caught$;
    }),
  )
  .subscribe({
    next(x) {
      console.log('got value ' + x);
    },
    error(err) {
      console.error('something wrong occurred: ' + err);
    },
    complete() {
      console.log('done');
    },
  });

function addTo(num: number) {
  return new Promise<number>((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.5) {
        console.log('I am good boy');
        resolve(num + 2);
        return;
      }
      reject(new Error("I'm a bad boy"));
    }, Math.random() * 1000);
  });
}

function uuidGen(num: number) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.5) {
        console.log('I am goodman');
        resolve(randomUUID() + num);
        return;
      }
      reject(new Error("I'm badman"));
    }, Math.random() * 1000);
  });
}
```

</td>
<td>
<table>
<tr>
  <th>First execution</th>
  <td>

```bash
First Error: I'm a bad boy
    at Timeout._onTimeout (/home/kasir/projects/er_inspection_data_service/a.ts:43:14)
    at listOnTimeout (node:internal/timers:594:17)
    at processTimers (node:internal/timers:529:7)
First Error: I'm a bad boy
    at Timeout._onTimeout (/home/kasir/projects/er_inspection_data_service/a.ts:43:14)
    at listOnTimeout (node:internal/timers:594:17)
    at processTimers (node:internal/timers:529:7)
First Error: I'm a bad boy
    at Timeout._onTimeout (/home/kasir/projects/er_inspection_data_service/a.ts:43:14)
    at listOnTimeout (node:internal/timers:594:17)
    at processTimers (node:internal/timers:529:7)
I am good boy
I am goodman
got value f42dc4dd-3059-4ea4-a227-040d9096c8f33
```

  </td>
</tr>
<tr>
  <th>Second execution</th>
  <td>

```bash
First Error: I'm a bad boy
    at Timeout._onTimeout (/home/kasir/projects/er_inspection_data_service/a.ts:43:14)
    at listOnTimeout (node:internal/timers:594:17)
    at processTimers (node:internal/timers:529:7)
I am good boy
Second Error: I'm badman
    at Timeout._onTimeout (/home/kasir/projects/er_inspection_data_service/a.ts:56:14)
    at listOnTimeout (node:internal/timers:594:17)
    at processTimers (node:internal/timers:529:7)
I am good boy
I am goodman
got value 9f6c8f71-834b-4697-bc87-cc4fe3473dd13
```

</td>
</tr>
</table>
