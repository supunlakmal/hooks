"use client";
import React, { useRef } from 'react';
import useDrag from '../../../hooks/useDrag';

const DragExample = () => {
  const dragRef = useRef<any>(null);
  const { isDragging } = useDrag(dragRef);
  
  const style : React.CSSProperties= {
    width: '100px',
    height: '100px',
    backgroundColor: isDragging ? 'lightgreen' : 'lightblue',
    position: 'relative',
    cursor: 'move',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };
  
  return (
    <div ref={dragRef} style={{...style}} >
      {isDragging ? "Dragging..." : "Drag Me!"}
    </div>
  );
};

export default DragExample;