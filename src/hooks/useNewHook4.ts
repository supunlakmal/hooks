import { useState } from 'react';

export const useNewHook4 = (): string => {
  const [message] = useState<string>('Hello from useNewHook4');
  return message;
};
