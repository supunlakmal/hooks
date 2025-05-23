import { useState } from 'react';

export const useNewHook78 = (): string => {
  const [message] = useState<string>('Hello from useNewHook78');
  return message;
};
