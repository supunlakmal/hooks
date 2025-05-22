import { useState } from 'react';

export const useNewHook21 = (): string => {
  const [message] = useState<string>('Hello from useNewHook21');
  return message;
};
