import { useState } from 'react';

export const useNewHook20 = (): string => {
  const [message] = useState<string>('Hello from useNewHook20');
  return message;
};
