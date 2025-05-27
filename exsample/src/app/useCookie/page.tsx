"use client";

import { useState, useEffect } from 'react';
import { useCookie } from '@/hooks/useCookie';

const UseCookiePage = () => {
  const [cookieValue, updateCookie, deleteCookie] = useCookie('myDemoCookie', 'InitialValue');
  const [newCookieValue, setNewCookieValue] = useState('');
  const [currentValFromHook, setCurrentValFromHook] = useState(cookieValue);

  useEffect(() => {
    setCurrentValFromHook(cookieValue);
  }, [cookieValue]);

  const handleUpdateCookie = () => {
    if (newCookieValue) {
      updateCookie(newCookieValue, { expires: 3600 }); // Expires in 1 hour (3600 seconds)
      setNewCookieValue('');
    } else {
      alert('Please enter a value for the cookie.');
    }
  };

  const handleDeleteCookie = () => {
    deleteCookie();
  };

  // Forcing a read directly from document.cookie for demonstration, 
  // as the hook's state might not update if the cookie is changed in another tab until next interaction.
  const [rawCookie, setRawCookie] = useState('');
  const refreshRawCookie = () => {
    const name = 'myDemoCookie=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
        c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
        setRawCookie(c.substring(name.length, c.length));
        return;
        }
    }
    setRawCookie('Not found');
  }

  useEffect(refreshRawCookie, [cookieValue]);


  return (
    <div style={{ padding: '20px' }}>
      <h1>useCookie Hook Example</h1>
      <p>This page demonstrates setting, getting, and deleting a browser cookie named &quot;myDemoCookie&quot;.</p>
      <p>Note: Cookies are browser-dependent. Check your browser&apos;s developer tools (Application &gt; Cookies) to see it in action.</p>

      <div style={{ marginTop: '20px', marginBottom: '20px' }}>
        <h3>Current Cookie Value (from hook):</h3>
        <p><strong>{currentValFromHook ?? 'Cookie not set or no initial value'}</strong></p>
        
        <h3>Current Cookie Value (raw from document.cookie):</h3>
        <p><strong>{rawCookie || 'Cookie not set or no initial value'}</strong></p>
        <button onClick={refreshRawCookie} style={{fontSize: '0.8em'}}>Refresh Raw Value</button>
      </div>

      <div style={{ marginTop: '20px', marginBottom: '20px' }}>
        <input 
          type="text" 
          value={newCookieValue} 
          onChange={(e) => setNewCookieValue(e.target.value)} 
          placeholder="Enter new cookie value"
          style={{ marginRight: '10px', padding: '5px' }}
        />
        <button onClick={handleUpdateCookie} style={{ marginRight: '10px' }}>
          Set/Update Cookie (expires in 1hr)
        </button>
        <button onClick={handleDeleteCookie}>
          Delete Cookie
        </button>
      </div>

      <p style={{ marginTop: '20px', fontSize: '0.9em', color: 'gray' }}>
        After setting or deleting, you might need to refresh the page or check developer tools
        to see changes reflected if they were made very quickly, although the hook attempts to keep state synchronized. The &quot;raw&quot; value provides a direct lookup.
      </p>
    </div>
  );
};

export default UseCookiePage;
