import { useState } from 'react';

export const useNewHook40 = (): string => {
  const [message] = useState<string>('Hello from useNewHook40');
  return message;
};
