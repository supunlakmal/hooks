"use client";
import React, { useRef } from 'react';
import useDraggable from '../../../hooks/useDraggable';

function DraggableExample() {
  const boxRef = useRef<any>(null);
  const { position, isDragging } = useDraggable(boxRef);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <div
        ref={boxRef}
        style={{
          position: 'absolute',
          left: position.x,
          top: position.y,
          width: '100px',
          height: '100px',
          backgroundColor: isDragging ? 'lightblue' : 'lightgreen',
          cursor: 'move',
          border: '1px solid black'
        }}
      >
        Draggable Box
      </div>
    </div>
  );
}

export default DraggableExample;