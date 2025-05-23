import { useState } from 'react';

export const useNewHook18 = (): string => {
  const [message] = useState<string>('Hello from useNewHook18');
  return message;
};
