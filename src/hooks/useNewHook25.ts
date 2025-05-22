import { useState } from 'react';

export const useNewHook25 = (): string => {
  const [message] = useState<string>('Hello from useNewHook25');
  return message;
};
