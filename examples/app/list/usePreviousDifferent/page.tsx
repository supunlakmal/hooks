// examples/app/list/usePreviousDifferent/page.tsx
'use client';
import { useState } from 'react';
import { usePrevious, usePreviousDifferent } from 'src';

export default function UsePreviousDifferentExample() {
  const [value, setValue] = useState(0);
  const previousValue = usePrevious(value);
  const previousDifferentValue = usePreviousDifferent(value);

  const toggleValue = () => {
    setValue(value === 0 ? 1 : 0);
  };

  return (
    <div>
      <button onClick={toggleValue}>Toggle Value</button>
      <p>Current Value: {value}</p>
      <p>Previous Value: {previousValue === undefined ? 'undefined' : previousValue}</p>
      <p>Previous Different Value: {previousDifferentValue === undefined ? 'undefined' : previousDifferentValue}</p>
    </div>
  );
}