import { useState } from 'react';

export const useNewHook14 = (): string => {
  const [message] = useState<string>('Hello from useNewHook14');
  return message;
};
