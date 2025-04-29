import { useEffect, useRef } from 'react';

type EffectCallback = () => void | (() => void);

function useIntervalEffect(effect: EffectCallback, delay: number | null): void {
  const savedEffect = useRef<EffectCallback | null>(null);

  useEffect(() => {
    savedEffect.current = effect;
  }, [effect]);

  useEffect(() => {
    if (delay === null) {
      return;
    }

    const tick = () => {
      if (savedEffect.current) {
        savedEffect.current();
      }
    };

    const id = setInterval(tick, delay);
    return () => clearInterval(id);
  }, [delay]);
}

export default useIntervalEffect;