import { useState } from 'react';

export const useNewHook39 = (): string => {
  const [message] = useState<string>('Hello from useNewHook39');
  return message;
};
