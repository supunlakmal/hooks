"use client"
import React from "react";
import useAsync from "../../../hooks/useAsync";

interface UserData {
    id: number;
    name: string;
    email: string;
}

const fetchUserData = async (): Promise<UserData> => {
    const userId = 1
    const response = await fetch(
        `https://jsonplaceholder.typicode.com/users/${userId}`
    );
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`); 
    }
    return response.json();
};

function UserProfile(){
    const {
        loading,
        error,
        value: userData,
    } = useAsync<UserData>(fetchUserData);

    if (loading) return <div>Loading user data...</div>;
    if (error) return <div>Error fetching user data: {error.message}</div>;
    if (!userData) return <div>No user data found.</div>;

    return (
        <div>
            <h1>{userData.name}</h1>
            <p>Email: {userData.email}</p>
        </div>
    );
}
export default UserProfile;
