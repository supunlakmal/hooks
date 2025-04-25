"use client"
import React, { useState } from "react";
import useDerivedState  from "../../hooks/useDerivedState";

function DerivedStateExample() {
    const [user, setUser] = useState({ firstName: "John", lastName: "Doe" });

    const fullName = useDerivedState(() => {
        console.log("Calculating full name...");
        return `${user.firstName} ${user.lastName}`;
    }, [user.firstName, user.lastName]);

    return (
        <div>
            <h1>useDerivedState Example</h1>
            <p>Full Name: {fullName}</p>
            <button onClick={() => setUser({ firstName: "Jane", lastName: "Smith" })}>
                Change Name
            </button>
        </div>
    );
}

export default DerivedStateExample;