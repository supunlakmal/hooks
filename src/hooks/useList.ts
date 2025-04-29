import { useCallback, useState } from 'react';

type ItemType = any;

const useList = (initialList: ItemType[] = []) => {
  const [list, setList] = useState<ItemType[]>(initialList);

  const addItem = useCallback((item: ItemType) => {
    setList((prevList) => [...prevList, item]);
  }, []);

  const removeItem = useCallback((index: number) => {
    setList((prevList) => {
      const newList = [...prevList];
      newList.splice(index, 1);
      return newList;
    });
  }, []);

  const updateItem = useCallback((index: number, newItem: ItemType) => {
    setList((prevList) => {
      const newList = [...prevList];
      if (index >= 0 && index < newList.length) {
        newList[index] = newItem;
      }
      return newList;
    });
  }, []);

  const clearList = useCallback(() => {
    setList([]);
  }, []);

  const moveItem = useCallback((from: number, to: number) => {
        setList(currentList => {
            const listCopy = [...currentList];
            const itemToMove = listCopy.splice(from, 1)[0];
            listCopy.splice(to, 0, itemToMove);
            return listCopy;
        });
    }, []);

  return {
    list,
    addItem,
    removeItem,
    updateItem,
    clearList,
    moveItem,
    setList
  };
};

export default useList;