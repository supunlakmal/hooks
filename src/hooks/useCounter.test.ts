import { renderHook, act } from '@testing-library/react';
import { useCounter } from './useCounter';

describe('useCounter', () => {
  it('should initialize with initial value', () => {
    const { result } = renderHook(() => useCounter(5));
    expect(result.current.count).toBe(5);
  });

  it('should increment count', () => {
    const { result } = renderHook(() => useCounter(0));
    act(() => {
      result.current.increment();
    });
    expect(result.current.count).toBe(1);
  });

  it('should decrement count', () => {
    const { result } = renderHook(() => useCounter(0));
    act(() => {
      result.current.decrement();
    });
    expect(result.current.count).toBe(-1);
  });

  it('should reset count', () => {
    const { result } = renderHook(() => useCounter(5));
    act(() => {
      result.current.reset();
    });
    expect(result.current.count).toBe(5);
  });

  it('should set count', () => {
    const { result } = renderHook(() => useCounter(0));
    act(() => {
      result.current.set(10);
    });
    expect(result.current.count).toBe(10);
  });
});
