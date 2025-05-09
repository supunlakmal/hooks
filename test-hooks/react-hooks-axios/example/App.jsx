import React, { useState } from 'react';

import useAxios from '../src';

export default function App() {
  const [gender, setGender] = useState('');
  const { response, loading, error, reFetch } = useAxios({
    url: `https://randomuser.me/api/${gender === 'unknown' ? 'unknown' : ''}`,
    method: 'GET',
    options: {
      params: { gender },
    },
    trigger: gender,
    // or
    // trigger: { gender }
    forceDispatchEffect: () => !!gender, // AUTO RUN only if gender is set
  });

  const { data } = response || {};

  const options = [
    { gender: 'female', title: 'Female' },
    { gender: 'male', title: 'Male' },
    { gender: 'unknown', title: 'Unknown' },
  ];

  if (loading) return 'loading...';
  return (
    <div>
      <h2>
        DEMO of
        <span style={{ color: '#F44336' }}>@use-hooks/axios</span>
      </h2>
      {options.map(item => (
        <div key={item.gender}>
          <input
            type="radio"
            id={item.gender}
            value={item.gender}
            checked={gender === item.gender}
            onChange={e => setGender(e.target.value)}
          />
          {item.title}
        </div>
      ))}
      <button type="button" onClick={reFetch}>
        Refresh
      </button>
      <div>
        {error ? (
          error.message || 'error'
        ) : (
          <textarea
            cols="100"
            rows="30"
            defaultValue={JSON.stringify(data || {}, '', 2)}
          />
        )}
      </div>
    </div>
  );
}
