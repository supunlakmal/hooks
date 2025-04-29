import { useState, useCallback } from 'react';

interface Actions {
  setTrue: () => void;
  setFalse: () => void;
  toggle: () => void;
  setValue: (value: boolean) => void;
}

function useBoolean(defaultValue = false): [boolean, Actions] {
  const [value, setValue] = useState<boolean>(defaultValue);

  const setTrue = useCallback(() => {
    setValue(true);
  }, []);

  const setFalse = useCallback(() => {
    setValue(false);
  }, []);

  const toggle = useCallback(() => {
    setValue((currentValue) => !currentValue);
  }, []);
  
  const set = useCallback((newValue:boolean)=>{
    setValue(newValue)
  },[])

  return [value, { setTrue, setFalse, toggle,setValue:set }];
}

export default useBoolean;