import React from 'react';

import { useDispatch, useTrackedState } from './context';

const TextBox: React.SFC<{ text: string }> = ({ text }) => {
  // eslint-disable-next-line no-console
  console.log('rendering text:', text);
  return <span>{text}</span>;
};

const PersonFirstName = () => {
  const state = useTrackedState();
  const dispatch = useDispatch();
  return (
    <div>
      First Name:
      <TextBox text={state.person.firstName} />
      <input
        value={state.person.firstName}
        onChange={(event) => {
          const firstName = event.target.value;
          dispatch({ firstName, type: 'setFirstName' });
        }}
      />
    </div>
  );
};

const PersonLastName = () => {
  const state = useTrackedState();
  const dispatch = useDispatch();
  return (
    <div>
      Last Name:
      <TextBox text={state.person.lastName} />
      <input
        value={state.person.lastName}
        onChange={(event) => {
          const lastName = event.target.value;
          dispatch({ lastName, type: 'setLastName' });
        }}
      />
    </div>
  );
};

const PersonAge = () => {
  const state = useTrackedState();
  const dispatch = useDispatch();
  return (
    <div>
      Age:
      <input
        value={state.person.age}
        onChange={(event) => {
          const age = Number(event.target.value) || 0;
          dispatch({ age, type: 'setAge' });
        }}
      />
    </div>
  );
};

const Person = () => (
  <>
    <PersonFirstName />
    <PersonLastName />
    <PersonAge />
  </>
);

export default Person;
