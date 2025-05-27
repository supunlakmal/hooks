"use client";

import { useBreakpoint } from '@/hooks/useBreakpoint';

// Define your breakpoints (optional, defaults are 'sm', 'md', 'lg', 'xl', '2xl')
const customBreakpoints = {
  xs: '480px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
};

const UseBreakpointPage = () => {
  // You can pass custom breakpoints or use the default ones
  const breakpoint = useBreakpoint(customBreakpoints); 
  const defaultBreakpoint = useBreakpoint();

  return (
    <div style={{ padding: '20px' }}>
      <h1>useBreakpoint Hook Example</h1>
      <p>This page demonstrates the useBreakpoint hook to track viewport width and identify the current breakpoint.</p>
      <p>Resize your browser window to see the breakpoint change.</p>
      
      <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc' }}>
        <h2>Breakpoint with Custom Values</h2>
        <p>Current Custom Breakpoint: <strong>{breakpoint}</strong></p>
        <p style={{ fontSize: '0.8em', color: 'gray' }}>
          (xs: &lt;480px, sm: &lt;640px, md: &lt;768px, lg: &lt;1024px, xl: &ge;1024px)
        </p>
      </div>

      <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc' }}>
        <h2>Breakpoint with Default TailwindCSS Values</h2>
        <p>Current Default Breakpoint: <strong>{defaultBreakpoint}</strong></p>
        <p style={{ fontSize: '0.8em', color: 'gray' }}>
          (sm: &lt;640px, md: &lt;768px, lg: &lt;1024px, xl: &lt;1280px, 2xl: &ge;1280px)
        </p>
      </div>

      <div style={{ marginTop: '30px' }}>
        <h3>Example Usage in Components:</h3>
        {breakpoint === 'xs' && <p style={{color: 'red'}}>You are on an extra small screen (custom).</p>}
        {breakpoint === 'sm' && <p style={{color: 'orange'}}>You are on a small screen (custom).</p>}
        {defaultBreakpoint === 'lg' && <p style={{color: 'green'}}>You are on a large screen (default).</p>}
      </div>
    </div>
  );
};

export default UseBreakpointPage;
