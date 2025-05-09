import React, { useCallback } from 'react';

import { useDispatch, useGlobalState } from './state2';

let numRendered = 0;

const Person = () => {
  const value = useGlobalState('person');
  const dispatch = useDispatch();
  const setFirstName = useCallback(
    (event: React.FormEvent<HTMLInputElement>) => dispatch({
      firstName: event.currentTarget.value,
      type: 'setFirstName',
    }),
    [dispatch],
  );
  const setLastName = useCallback(
    (event: React.FormEvent<HTMLInputElement>) => dispatch({
      lastName: event.currentTarget.value,
      type: 'setLastName',
    }),
    [dispatch],
  );
  const setAge = useCallback(
    (event: React.FormEvent<HTMLInputElement>) => dispatch({
      age: Number(event.currentTarget.value) || 0,
      type: 'setAge',
    }),
    [dispatch],
  );
  numRendered += 1;
  return (
    <div>
      <div>
        First Name:
        <input value={value.firstName} onChange={setFirstName} />
      </div>
      <div>
        Last Name:
        <input value={value.lastName} onChange={setLastName} />
      </div>
      <div>
        Age:
        <input value={value.age} onChange={setAge} />
      </div>
      <div>(numRendered: {numRendered})</div>
    </div>
  );
};

export default Person;
