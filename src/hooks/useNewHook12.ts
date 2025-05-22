import { useState } from 'react';

export const useNewHook12 = (): string => {
  const [message] = useState<string>('Hello from useNewHook12');
  return message;
};
