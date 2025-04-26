'use client';
import { useThrottledState } from 'src';
import { ChangeEvent, useState } from 'react';

export default function UseThrottledStateExample() {
  const [immediateValue, setImmediateValue] = useState<string>('');
  const [throttledValue, setThrottledValue] = useThrottledState<string>('', 300);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setImmediateValue(event.target.value);
    setThrottledValue(event.target.value);
  };

  return (
    <div>
      <input type="text" onChange={handleChange} />
      <p>Immediate Value: {immediateValue}</p>
      <p>Throttled Value: {throttledValue}</p>
    </div>
  );
}