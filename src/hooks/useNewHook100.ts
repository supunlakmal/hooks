import { useState } from 'react';

export const useNewHook100 = (): string => {
  const [message] = useState<string>('Hello from useNewHook100');
  return message;
};
