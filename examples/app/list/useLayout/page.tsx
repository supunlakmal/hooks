tsx
import React from 'react';
import { useLayout } from 'react-hooks-kit';

interface SlotProps {
  name: string;
  children: React.ReactNode;
}

const Slot: React.FC<SlotProps> = ({ name, children }) => {
  const { defineSlot } = useLayout();
  defineSlot(name, children);
  return null;
};

const ComponentWithLayout: React.FC = () => {
  const { useSlot } = useLayout();

  return (
    <div>
      <h1>Component with Layout</h1>
      <div>{useSlot('header')}</div>
      <div>{useSlot('main')}</div>
      <div>{useSlot('footer')}</div>

      <Slot name="header">
        <h2>Header Content</h2>
      </Slot>
      <Slot name="main">
        <p>Main content</p>
      </Slot>
      <Slot name="footer">
        <p>Footer content</p>
      </Slot>
    </div>
  );
};

export default ComponentWithLayout;