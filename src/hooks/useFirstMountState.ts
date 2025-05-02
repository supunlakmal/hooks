import { useRef } from 'react';
export function useFirstMountState(): boolean {
    const isFirst = useRef(false); if (isFirst.current) { return false } isFirst.current = true; return true }