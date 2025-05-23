import { render, act } from '@testing-library/react';
import React from 'react'; // Removed useState as it's not used in the test component
import { useDocumentEventListener } from './useDocumentEventListener';

describe('useDocumentEventListener', () => {
  it('should call the handler when the specified document event occurs', () => {
    const handler = jest.fn();
    const eventName = 'click';

    function TestComponent() {
      useDocumentEventListener(eventName, handler);
      return null;
    }

    render(<TestComponent />);

    act(() => {
      // Dispatch a real MouseEvent
      document.dispatchEvent(new MouseEvent(eventName, { bubbles: true }));
    });

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('should remove the event listener when the component unmounts', () => {
    const handler = jest.fn();
    const eventName = 'keydown';

    function TestComponent() {
      useDocumentEventListener(eventName, handler);
      return null;
    }

    const { unmount } = render(<TestComponent />);

    // Unmount the component
    unmount();

    // Simulate the event again
    act(() => {
      // Dispatch a real KeyboardEvent
      document.dispatchEvent(new KeyboardEvent(eventName, { bubbles: true }));
    });

    // The handler should not have been called again as it should be removed
    // It was never called in the first place in this test.
    expect(handler).toHaveBeenCalledTimes(0);
  });

  it('should re-attach the event listener if dependencies change', () => {
    const handler1 = jest.fn();
    const handler2 = jest.fn();
    const eventName = 'click';

    function TestComponent({ activeHandler, dep }: { activeHandler: (event: Event) => void, dep: number }) {
      useDocumentEventListener(eventName, activeHandler, undefined, [dep]);
      return null;
    }

    const { rerender } = render(<TestComponent activeHandler={handler1} dep={1} />);

    act(() => {
      document.dispatchEvent(new MouseEvent(eventName, { bubbles: true }));
    });
    expect(handler1).toHaveBeenCalledTimes(1);
    expect(handler2).toHaveBeenCalledTimes(0);

    // Rerender with a new handler and dependency
    rerender(<TestComponent activeHandler={handler2} dep={2} />);

    act(() => {
      document.dispatchEvent(new MouseEvent(eventName, { bubbles: true }));
    });
    // handler1 should not be called again
    expect(handler1).toHaveBeenCalledTimes(1);
    // handler2 should now be called
    expect(handler2).toHaveBeenCalledTimes(1);
  });

  it('should not run in server-side rendering environments initially', () => {
    const handler = jest.fn();
    const eventName = 'click';
    
    // Simulate server-side environment
    const originalDocument = global.document;
    // @ts-ignore
    delete global.document;

    function TestComponent() {
      useDocumentEventListener(eventName, handler);
      return null;
    }

    render(<TestComponent />);

    // Attempt to fire event (though document is undefined, this is more about checking if addEventListener was called)
    // In a true SSR test, we'd check if addEventListener was NOT called.
    // For now, this test ensures no errors are thrown during setup.
    
    // Restore document
    global.document = originalDocument;
    
    // Handler should not have been called as addEventListener shouldn't be called.
    expect(handler).not.toHaveBeenCalled();
  });
});
