import { useState, useCallback } from 'react';

export function useListState<T>(initialState: T[] = []): [
  T[],
  (item: T) => void,
  (callback: (item: T) => boolean) => void,
  (index: number, newItem: T) => void,
  (index: number) => void,
  (newList: T[]) => void,
  () => void
] {
  const [list, setList] = useState<T[]>(initialState);

  const push = useCallback((item: T) => {
    setList((prevList) => [...prevList, item]);
  }, []);

  const filter = useCallback((callback: (item: T) => boolean) => {
    setList((prevList) => prevList.filter(callback));
  }, []);

  const update = useCallback((index: number, newItem: T) => {
    setList((prevList) => {
      const newList = [...prevList];
      if (index >= 0 && index < newList.length) {
        newList[index] = newItem;
      }
      return newList;
    });
  }, []);

  const remove = useCallback((index: number) => {
    setList((prevList) => {
      if (index >= 0 && index < prevList.length) {
        return prevList.filter((_, i) => i !== index);
      }
      return prevList;
    });
  }, []);

  const set = useCallback((newList: T[]) => {
    setList(newList);
  }, []);

  const clear = useCallback(() => {
    setList([]);
  }, []);

  return [list, push, filter, update, remove, set, clear];
}