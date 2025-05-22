import { useState } from 'react';

export const useNewHook3 = (): string => {
  const [message] = useState<string>('Hello from useNewHook3');
  return message;
};
