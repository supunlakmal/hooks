import { useState } from 'react';

export const useNewHook97 = (): string => {
  const [message] = useState<string>('Hello from useNewHook97');
  return message;
};
