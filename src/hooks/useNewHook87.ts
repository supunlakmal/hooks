import { useState } from 'react';

export const useNewHook87 = (): string => {
  const [message] = useState<string>('Hello from useNewHook87');
  return message;
};
