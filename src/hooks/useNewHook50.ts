import { useState } from 'react';

export const useNewHook50 = (): string => {
  const [message] = useState<string>('Hello from useNewHook50');
  return message;
};
