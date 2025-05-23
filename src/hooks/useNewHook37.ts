import { useState } from 'react';

export const useNewHook37 = (): string => {
  const [message] = useState<string>('Hello from useNewHook37');
  return message;
};
