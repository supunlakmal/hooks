import { useState } from 'react';

export const useNewHook36 = (): string => {
  const [message] = useState<string>('Hello from useNewHook36');
  return message;
};
