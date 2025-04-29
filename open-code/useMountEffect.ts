import { useEffect } from 'react';

const useMountEffect = (callback: () => void | (() => void)) => {
  useEffect(() => {
    const cleanup = callback();
    return () => {
      if (typeof cleanup === 'function') {
        cleanup();
      }
    };
  }, []);
};

export default useMountEffect;