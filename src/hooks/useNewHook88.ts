import { useState } from 'react';

export const useNewHook88 = (): string => {
  const [message] = useState<string>('Hello from useNewHook88');
  return message;
};
