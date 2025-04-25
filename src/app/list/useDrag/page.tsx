"use client";
import React, { useRef } from 'react';
import useDrag from '../../../hooks/useDrag';

const DragExample = () => {
  const dragRef = useRef<any>(null);
  const { position } = useDrag(dragRef);

  const style = {
    width: '100px',
    height: '100px',
    backgroundColor: 'lightblue',
    position: 'absolute',
    left: `${position.x}px`,
    top: `${position.y}px`,
    cursor: 'move',
  };

  return (
    <div ref={dragRef} style={style}>
      Drag Me!
    </div>
  );
};

export default DragExample;