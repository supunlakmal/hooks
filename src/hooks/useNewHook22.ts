import { useState } from 'react';

export const useNewHook22 = (): string => {
  const [message] = useState<string>('Hello from useNewHook22');
  return message;
};
