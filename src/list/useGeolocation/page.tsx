import React from "react";
import { useGeolocation } from "../../hooks/useGeolocation";

function GeolocationExample() {
    const {
        loading,
        latitude,
        longitude,
        accuracy,
        error,
    } = useGeolocation({ enableHighAccuracy: true });

    if (loading) {
        return <p>Loading geolocation data...</p>;
    }

    if (error) {
        return <p>Error: {error.message}</p>;
    }

    return (
        <div>
            <h1>Geolocation Data</h1>
            <ul>
                <li>Latitude: {latitude}</li>
                <li>Longitude: {longitude}</li>
                <li>Accuracy: {accuracy} meters</li>
            </ul>
        </div>
    );
}

export default GeolocationExample;