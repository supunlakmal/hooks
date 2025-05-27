"use client";

import { useState, useRef } from 'react';
import { useClickOutside } from '@/hooks/useClickOutside';

const UseClickOutsidePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Ensure modalRef is defined as useRef<HTMLDivElement>(null) as per instruction
  const modalRef = useRef<HTMLDivElement>(null); 

  useClickOutside(modalRef, () => {
    if (isModalOpen) {
      setIsModalOpen(false);
    }
  });

  return (
    <div style={{ padding: '20px', height: '300px' /* Ensure there is space to click outside */ }}>
      <h1>useClickOutside Hook Example</h1>
      <p>This page demonstrates the useClickOutside hook.</p>
      <p>Click the button to open the &quot;modal&quot;. Clicking outside the modal will close it.</p>

      <button onClick={() => setIsModalOpen(true)} disabled={isModalOpen} style={{ marginTop: '20px' }}>
        Open Modal
      </button>

      {isModalOpen && (
        <div
          ref={modalRef}
          style={{
            marginTop: '20px',
            padding: '30px',
            border: '1px solid #ccc',
            backgroundColor: '#f9f9f9',
            width: '300px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          }}
        >
          <h2>Modal Content</h2>
          <p>This is the modal. Click anywhere outside of this box to close it.</p>
        </div>
      )}
    </div>
  );
};

export default UseClickOutsidePage;
