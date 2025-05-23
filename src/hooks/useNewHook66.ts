import { useState } from 'react';

export const useNewHook66 = (): string => {
  const [message] = useState<string>('Hello from useNewHook66');
  return message;
};
