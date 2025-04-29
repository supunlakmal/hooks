import dayjs from 'dayjs';
import { useEffect, useMemo, useState, useCallback } from 'react';
import useLatest from '../useLatest';

type TargetDate = dayjs.ConfigType;

interface CountDownOptions {
  leftTime?: number;
  targetDate?: TargetDate;
  interval?: number;
  onEnd?: () => void;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
}

const isNumber = (value: any): value is number => typeof value === 'number';

const calculateTimeLeft = (target?: TargetDate) => {
  if (!target) {
    return 0;
  }
  const timeLeft = dayjs(target).valueOf() - Date.now();
  return timeLeft < 0 ? 0 : timeLeft;
};

const formatMilliseconds = (milliseconds: number): TimeLeft => {
  return {
    days: Math.floor(milliseconds / 86400000),
    hours: Math.floor(milliseconds / 3600000) % 24,
    minutes: Math.floor(milliseconds / 60000) % 60,
    seconds: Math.floor(milliseconds / 1000) % 60,
    milliseconds: Math.floor(milliseconds) % 1000,
  };
};

const useCountDown = (options: CountDownOptions = {}) => {
  const { leftTime, targetDate, interval = 1000, onEnd } = options;

  const startTime = useMemo<TargetDate>(() => {
    return isNumber(leftTime) && leftTime > 0 ? 
      ? Date.now() + leftTime
      : undefined;
  }, [leftTime]);

  const target = 'leftTime' in options ? startTime : targetDate;

  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(target));

  const onComplete = useLatest(onEnd);

  const stop = useCallback(()=>{
    setTimeLeft(0);
  },[])

  useEffect(() => {
    if (!target) {
      // for stop
      stop()
      return;
    }

    // run once
    setTimeLeft(calculateTimeLeft(target));

    const timer = setInterval(() => {
      const targetLeft = calculateTimeLeft(target);
      setTimeLeft(targetLeft);
      if (targetLeft === 0) {
        clearInterval(timer);
        onComplete.current?.();
      }
    }, interval);

    return () => clearInterval(timer);
  }, [target, interval]);

  const formattedTimeLeft = useMemo(
    () => formatMilliseconds(timeLeft),
    [timeLeft],
  );

  return [timeLeft, formattedTimeLeft, stop] as const;
};

export default useCountDown;