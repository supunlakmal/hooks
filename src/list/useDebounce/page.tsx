import React, { useState, useEffect } from "react";
import useDebounce  from "../../hooks/useDebounce";

function DebounceExample() {
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearchTerm = useDebounce(searchTerm, 500); // 500ms delay

    useEffect(() => {
        if (debouncedSearchTerm) {
            console.log(`Searching for "${debouncedSearchTerm}"...`);
        } else {
            console.log("Search term is empty.");
        }
    }, [debouncedSearchTerm]);

    return (
        <div>
            <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <p>Typing: {searchTerm}</p>
            <p>Debounced: {debouncedSearchTerm}</p>
        </div>
    );
}

export default DebounceExample;