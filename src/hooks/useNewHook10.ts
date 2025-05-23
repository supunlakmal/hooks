import { useState } from 'react';

export const useNewHook10 = (): string => {
  const [message] = useState<string>('Hello from useNewHook10');
  return message;
};
