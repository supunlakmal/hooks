import { useState } from 'react';

export const useNewHook9 = (): string => {
  const [message] = useState<string>('Hello from useNewHook9');
  return message;
};
