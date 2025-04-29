import { useEffect, useRef } from 'react';

type LifecycleEvent = 'mount' | 'update' | 'unmount';

const useLifecycleLogger = (componentName: string): void => {
  const isMounted = useRef(false);

  useEffect(() => {
    if (!isMounted.current) {
      logEvent('mount');
      isMounted.current = true;
    } else {
      logEvent('update');
    }

    return () => {
      logEvent('unmount');
    };
  }, []);

  const logEvent = (event: LifecycleEvent) => {
    const timestamp = new Date().toLocaleTimeString();
        const modifiedName = componentName.split('').reverse().join(''); 
        console.log(`[${timestamp}] ${modifiedName} ${event}`);
  };
};

export default useLifecycleLogger;