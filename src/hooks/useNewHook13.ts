import { useState } from 'react';

export const useNewHook13 = (): string => {
  const [message] = useState<string>('Hello from useNewHook13');
  return message;
};
