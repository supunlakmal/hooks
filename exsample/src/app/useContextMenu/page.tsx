"use client";

import { useRef } from 'react';
import { useContextMenu } from '@/hooks/useContextMenu';

const UseContextMenuPage = () => {
  const targetAreaRef = useRef<HTMLDivElement>(null);
  const { isOpen, position, open: openMenu, close: closeMenu } = useContextMenu(targetAreaRef);

  // Note: The useContextMenu hook itself doesn't create the menu UI.
  // It provides the state (isOpen, position) to render your own menu component.

  const handleMenuAction = (action: string) => {
    console.log(`Context menu action: ${action}`);
    closeMenu(); // Close menu after action
  };

  return (
    <div style={{ padding: '20px', minHeight: '400px' }}>
      <h1>useContextMenu Hook Example</h1>
      <p>Right-click inside the designated area below to trigger a custom context menu.</p>
      <p>Clicking outside the menu or scrolling will close it.</p>

      <div
        ref={targetAreaRef}
        style={{
          marginTop: '30px',
          width: '300px',
          height: '200px',
          backgroundColor: '#f0f0f0',
          border: '2px dashed #ccc',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          userSelect: 'none',
        }}
      >
        Right-click here!
        <br />
        (Or long-press on touch devices if browser supports it)
      </div>

      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: `${position.y}px`,
            left: `${position.x}px`,
            border: '1px solid #ddd',
            backgroundColor: 'white',
            boxShadow: '0 2px 5px rgba(0,0,0,0.15)',
            padding: '5px 0',
            zIndex: 1000,
            minWidth: '150px',
          }}
          onClick={(e) => e.stopPropagation()} // Prevent click inside menu from closing it immediately
        >
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            <li onClick={() => handleMenuAction('Action 1')} style={menuItemStyle}>Action 1</li>
            <li onClick={() => handleMenuAction('Action 2')} style={menuItemStyle}>Action 2</li>
            <li onClick={() => handleMenuAction('Another Action')} style={menuItemStyle}>Another Action</li>
            <hr style={{ margin: '4px 0', border: 0, borderTop: '1px solid #eee' }} />
            <li onClick={closeMenu} style={menuItemStyle}>Close Menu</li>
          </ul>
        </div>
      )}

      <div style={{marginTop: '20px'}}>
        <button onClick={(e) => { 
          e.preventDefault(); // Prevent default context menu
          // Simulate a MouseEvent for openMenu. In a real scenario, you might get this from another event.
          const mockEvent = new MouseEvent('click', { clientX: 200, clientY: 200 });
          openMenu(mockEvent);
        }}>
          Manually Open Menu at (200,200)
        </button>
      </div>
    </div>
  );
};

const menuItemStyle: React.CSSProperties = {
  padding: '8px 15px',
  cursor: 'pointer',
};

// Add a hover effect for menu items using a global style or more complex styling solution if needed
// For simplicity, inline hover effect is not added here but can be done with onMouseEnter/Leave
// or CSS classes. Example:
// onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
// onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}


export default UseContextMenuPage;
