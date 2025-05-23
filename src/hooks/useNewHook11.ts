import { useState } from 'react';

export const useNewHook11 = (): string => {
  const [message] = useState<string>('Hello from useNewHook11');
  return message;
};
