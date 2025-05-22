import { useState } from 'react';

export const useNewHook17 = (): string => {
  const [message] = useState<string>('Hello from useNewHook17');
  return message;
};
