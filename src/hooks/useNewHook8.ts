import { useState } from 'react';

export const useNewHook8 = (): string => {
  const [message] = useState<string>('Hello from useNewHook8');
  return message;
};
