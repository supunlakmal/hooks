import { useState } from 'react';

export const useNewHook23 = (): string => {
  const [message] = useState<string>('Hello from useNewHook23');
  return message;
};
