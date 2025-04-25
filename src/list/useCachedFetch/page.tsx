import React, { useState } from "react";
import useCachedFetch from "../../hooks/useCachedFetch";

interface User {
    id: number;
    name: string;
    username: string;
    email: string;
}

const UserDisplay: React.FC<{ userId: number }> = ({ userId }) => {
    const { data, error, isLoading, status, refetch } = useCachedFetch<User>(
        `https://jsonplaceholder.typicode.com/users/${userId}`,
        {
            ttl: 60 * 1000, // Cache for 1 minute
        }
    );

    if (isLoading) return <p>Loading user {userId}...</p>;
    if (error)
        return (
            <p style={{ color: "red" }}>
                Error fetching user {userId}: {error.message}
            </p>
        );
    if (!data) return <p>No data for user {userId}.</p>;

    return (
        <div
            style={{ border: "1px solid lightgray", margin: "10px", padding: "10px" }}
        >
            <h4>
                {data.name} (@{data.username})
            </h4>
            <p>Email: {data.email}</p>
            <p>Status: {status}</p>
            <button onClick={() => refetch()}>Refetch User {userId}</button>
            <button onClick={() => refetch({ ignoreCache: true })}>
                Refetch User {userId} (Bypass Cache)
            </button>
        </div>
    );
};

const App: React.FC = () => {
    const [selectedUserId, setSelectedUserId] = useState<number>(1);
    const [showUser, setShowUser] = useState<boolean>(true);

    return (
        <div>
            <h2>Cached Fetch Demo</h2>
            <p>
                Select a user ID. Data is cached for 1 minute. Check network tab and
                console logs.
            </p>
            <div>
                {[1, 2, 3, 4, 5].map((id) => (
                    <button
                        key={id}
                        onClick={() => setSelectedUserId(id)}
                        style={{ fontWeight: selectedUserId === id ? "bold" : "normal" }}
                    >
                        User {id}
                    </button>
                ))}
                <button
                    onClick={() => setShowUser((s) => !s)}
                    style={{ marginLeft: "20px" }}
                >
                    {showUser ? "Hide User" : "Show User"}
                </button>
            </div>

            {showUser && <UserDisplay userId={selectedUserId} />}
        </div>
    );
};

export default App;