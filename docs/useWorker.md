# useWorker

## Description

The `useWorker` hook allows you to offload expensive computations or functions to a separate Web Worker thread. This prevents the main UI thread from being blocked, ensuring a smooth and responsive user experience. It handles the creation, communication, and termination of the worker.

## Parameters

- `workerFunction`: (Required) A function that will be executed inside the Web Worker. This function should be pure, meaning it doesn't rely on external state and always returns the same output for the same input. It should accept one parameter, which is the data passed to the `execute` function, and it should return the result of the computation.

## Return Value

The `useWorker` hook returns an object with the following properties:

- `execute`: A function to start the worker. It accepts a single argument that will be passed to the `workerFunction`.
- `result`: The result of the `workerFunction` execution, or `undefined` if the worker hasn't finished yet or encountered an error.
- `error`: Any error thrown by the `workerFunction` during its execution, or `undefined` if no error occurred.
- `isLoading`: A boolean indicating whether the worker is currently executing the function.
- `terminate`: A function to terminate the worker manually. This can be used to clean up the worker if you no longer need it.

## Example

```
typescript jsx
import { useWorker } from './useWorker';

function MyComponent() {
  const { execute, result, error, isLoading, terminate } = useWorker((data: number) => {
    // Simulate a heavy computation
    let sum = 0;
    for (let i = 0; i < data; i++) {
      sum += i;
    }
    return sum;
  });

  const handleClick = () => {
    execute(100000000);
  };

  return (
    <div>
      <button onClick={handleClick} disabled={isLoading}>
        Compute
      </button>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {result !== undefined && <p>Result: {result}</p>}
      <button onClick={terminate} disabled={!isLoading}>Terminate</button>

    </div>
  );
}
```

## Related Hooks

- [`useWebWorker`](./useWebWorker.md): Similar to `useWorker`, this hook provides another way to run functions in a separate Web Worker.
