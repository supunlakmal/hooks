import { useState } from 'react';

export const useNewHook38 = (): string => {
  const [message] = useState<string>('Hello from useNewHook38');
  return message;
};
