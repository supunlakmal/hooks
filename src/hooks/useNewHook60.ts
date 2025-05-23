import { useState } from 'react';

export const useNewHook60 = (): string => {
  const [message] = useState<string>('Hello from useNewHook60');
  return message;
};
