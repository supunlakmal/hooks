import { useState } from 'react';

export const useNewHook2 = (): string => {
  const [message] = useState<string>('Hello from useNewHook2');
  return message;
};
