'use client'

import useDebouncedState  from '../../../../src/hooks/useDebouncedState';
import { ChangeEvent, useState } from 'react';

export default function UseDebouncedStateExample() {
    const [searchTerm, setSearchTerm] = useDebouncedState<string>('', 300);
    const [immediateSearchTerm, setImmediateSearchTerm] = useState<string>('');

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
        setImmediateSearchTerm(event.target.value);
    };

    return (
        <div>
            <input type="text" onChange={handleChange} />
            <p>Immediate Search Term: {immediateSearchTerm}</p>
            <p>Debounced Search Term: {searchTerm}</p>
        </div>
    );
}