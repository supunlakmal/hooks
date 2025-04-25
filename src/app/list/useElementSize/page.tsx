"use client";
import React, { useRef } from 'react';
import useElementSize from '../../../hooks/useElementSize';

function ElementSizeExample() {
  const divRef = useRef<HTMLDivElement>(null);
  const { width, height } = useElementSize(divRef);

  return (
    <div>
      <div ref={divRef} style={{ width: '200px', height: '100px', border: '1px solid black' }}>
        Resizable Div
      </div>
      <p>Width: {width}px</p>
      <p>Height: {height}px</p>
    </div>
  );
}

export default ElementSizeExample;