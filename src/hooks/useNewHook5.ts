import { useState } from 'react';

export const useNewHook5 = (): string => {
  const [message] = useState<string>('Hello from useNewHook5');
  return message;
};
