import { useState } from 'react';

export const useNewHook26 = (): string => {
  const [message] = useState<string>('Hello from useNewHook26');
  return message;
};
