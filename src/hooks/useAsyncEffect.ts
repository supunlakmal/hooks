import { useEffect, DependencyList } from 'react';

type AsyncEffectCallback = (signal?: AbortSignal) => Promise<void> | AsyncGenerator<void>;

function useAsyncEffect(effect: AsyncEffectCallback, deps?: DependencyList) {
  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    let result: Promise<void> | AsyncGenerator<void>
    try {
        result = effect(signal);
      } catch (error) {
        console.error('Error in useAsyncEffect:', error);
        return;
      }

    if (result instanceof Promise) {
        result.catch(error=>{
            console.error('Error in useAsyncEffect:', error);
        })
      } else {
          (async () => {
              try {
                for await (const _ of result) {
                  if (signal.aborted) {
                    return;
                  }
                }
              } catch (error) {
                  console.error('Error in useAsyncEffect:', error);
              }
          })()
          
    }
    return () => {
      try {
        controller.abort();
      } catch (error) {
        console.error('Error in useAsyncEffect abort:', error);
      }
    };
  }, deps);
}

export default useAsyncEffect;