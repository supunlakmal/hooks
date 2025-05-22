import { useState } from 'react';

export const useNewHook90 = (): string => {
  const [message] = useState<string>('Hello from useNewHook90');
  return message;
};
