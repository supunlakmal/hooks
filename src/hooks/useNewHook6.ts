import { useState } from 'react';

export const useNewHook6 = (): string => {
  const [message] = useState<string>('Hello from useNewHook6');
  return message;
};
