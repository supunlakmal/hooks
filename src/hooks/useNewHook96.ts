import { useState } from 'react';

export const useNewHook96 = (): string => {
  const [message] = useState<string>('Hello from useNewHook96');
  return message;
};
