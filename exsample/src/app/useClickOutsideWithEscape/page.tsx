"use client";

import { useState, useRef } from 'react';
import { useClickOutsideWithEscape } from '@/hooks/useClickOutsideWithEscape'; // Will be created

const UseClickOutsideWithEscapePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Use the hook to close the modal
  useClickOutsideWithEscape(modalRef, () => {
    if (isModalOpen) {
      setIsModalOpen(false);
      console.log('Modal closed by outside click or Escape key');
    }
  });

  return (
    <div style={{ padding: '20px', minHeight: '300px' /* Ensure space to click outside */ }}>
      <h1>useClickOutsideWithEscape Hook Example</h1>
      <p>This page demonstrates a modal that closes on outside click or Escape key press.</p>
      <p>Press Escape or click outside the modal area to close it.</p>

      <button onClick={() => setIsModalOpen(true)} disabled={isModalOpen} style={{ marginTop: '20px' }}>
        Open Modal
      </button>

      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            padding: '30px',
            border: '1px solid #ccc',
            backgroundColor: '#f9f9f9',
            width: '300px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            zIndex: 1000,
          }}
        >
          <div ref={modalRef}>
            <h2>Modal Content</h2>
            <p>This is the modal. Click anywhere outside of this box or press Escape to close it.</p>
            <button onClick={() => setIsModalOpen(false)} style={{ marginTop: '10px' }}>
              Close Manually
            </button>
          </div>
        </div>
      )}
      {isModalOpen && (
         <div style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', 
            backgroundColor: 'rgba(0,0,0,0.1)', zIndex: 999 
         }} />
      )}
    </div>
  );
};

export default UseClickOutsideWithEscapePage;
