import { useRef } from 'react';
export const useFirstMountState = (): boolean => {
  const isFirst = useRef(false);
  if (isFirst.current) {
    return false;
  }
  isFirst.current = true;
  return true;
};
