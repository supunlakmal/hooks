# useWebWorker

`useWebWorker` is a React hook that simplifies running functions in a separate Web Worker thread. This is particularly useful for computationally intensive tasks that might otherwise block the main UI thread, ensuring a smoother and more responsive user experience.

## What it does

This hook allows you to offload heavy computations to a background thread. By doing so, you can keep your main application thread free to handle UI updates and user interactions without interruption. The `useWebWorker` hook takes care of creating, managing, and communicating with the Web Worker.

## Parameters

The `useWebWorker` hook accepts one parameter:

- **`workerFunction`**: `(...args: any[]) => Promise<any>` or `(...args: any[]) => any`

  A function that you want to execute in the Web Worker. This can be a synchronous or an asynchronous function. If it is asynchronous, the promise will be resolved/rejected in the main thread.

## Return Value

The `useWebWorker` hook returns an object with the following properties:

- **`execute`**: `(...args: any[]) => Promise<any>`

  A function to trigger the execution of `workerFunction` in the Web Worker. It accepts any number of arguments that will be passed to the `workerFunction`. It returns a promise which will resolve to the value returned by the worker or rejected with an error thrown in the worker.

- **`result`**: `any`

  The result returned by `workerFunction` after it has been executed. `null` until the worker is done.

- **`error`**: `any`

  If an error occurs during the execution of `workerFunction` in the Web Worker, this will hold the error. `null` if no error occurred.

- **`working`**: `boolean`

  A boolean indicating whether the Web Worker is currently executing `workerFunction`. `true` if the worker is running, `false` otherwise.

- **`terminate`**: `()=> void`

A function that terminates the worker, it should be called when the component unmounts.

## Example

```
typescript jsx
import { useWebWorker } from 'react-use';
import { useEffect } from 'react';

function MyComponent() {
  const myHeavyFunction = (input: number) => {
    let sum = 0;
    for (let i = 0; i < input; i++) {
      sum += i;
    }
    return sum;
  };

  const { execute, result, error, working ,terminate} = useWebWorker(myHeavyFunction);

    useEffect(()=> {
      return () => {
        terminate();
      }
    },[]);

  const handleClick = () => {
    execute(100000000); // Large input to simulate heavy computation
  };

  return (
    <div>
      <button onClick={handleClick} disabled={working}>
        Calculate Sum
      </button>
      {working && <p>Calculating...</p>}
      {error && <p>Error: {error.message}</p>}
      {result !== null && <p>Result: {result}</p>}
    </div>
  );
}
```

In this example, `myHeavyFunction` is a function that performs a computationally intensive task. `useWebWorker` allows you to run this function in a separate thread. When the button is clicked, `execute` is called to start the worker, and `working` is set to `true`. Once the worker completes, `result` will hold the computed sum, and `working` will be set back to `false`. If error occurred it will be assigned to `error`.

## Related Hooks

- [`useWorker`](./useWorker.md): A similar hook that also runs functions in a web worker but with a different name.
