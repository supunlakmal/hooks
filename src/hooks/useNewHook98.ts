import { useState } from 'react';

export const useNewHook98 = (): string => {
  const [message] = useState<string>('Hello from useNewHook98');
  return message;
};
