import { useState } from 'react';

export const useNewHook28 = (): string => {
  const [message] = useState<string>('Hello from useNewHook28');
  return message;
};
