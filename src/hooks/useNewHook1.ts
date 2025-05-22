import { useState } from 'react';

export const useNewHook1 = (): string => {
  const [message] = useState<string>('Hello from useNewHook1');
  return message;
};
