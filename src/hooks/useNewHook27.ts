import { useState } from 'react';

export const useNewHook27 = (): string => {
  const [message] = useState<string>('Hello from useNewHook27');
  return message;
};
