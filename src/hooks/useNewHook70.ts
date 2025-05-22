import { useState } from 'react';

export const useNewHook70 = (): string => {
  const [message] = useState<string>('Hello from useNewHook70');
  return message;
};
