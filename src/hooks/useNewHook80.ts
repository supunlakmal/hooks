import { useState } from 'react';

export const useNewHook80 = (): string => {
  const [message] = useState<string>('Hello from useNewHook80');
  return message;
};
