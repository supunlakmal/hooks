# `useLocationBasedFetch` Hook

## Description

This hook provides a way to fetch data from an API endpoint based on the user's geographical location. It leverages the browser's Geolocation API to obtain the user's latitude and longitude, and then uses these coordinates to construct a dynamic API request. This is useful for applications that need to display location-specific content, such as weather information, nearby points of interest, or location-based recommendations.

## Usage

Here's an example of how to use the `useLocationBasedFetch` hook:

```
typescript
import { useLocationBasedFetch } from '@supunlakmal/hooks';

function MyComponent() {
  const { data, isLoading, error } = useLocationBasedFetch('https://api.example.com/location-based-data');

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (data) {
    return (
      <div>
        {/* Display your location-based data here */}
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    );
  }

  return null;
}
```

## API

```
typescript
type LocationBasedFetchResult<T> = {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
};

type useLocationBasedFetch = <T>(
  baseUrl: string,
  options?: RequestInit,
  dependencyArray?: any[]
) => LocationBasedFetchResult<T>;
```

## Parameters

- **baseUrl**: `string`
  - The base URL of the API endpoint to fetch data from. This URL should be designed to accept latitude and longitude as query parameters.
  - Required.
- **options**: `RequestInit` (optional)
  - An optional object to configure the fetch request, similar to the standard `fetch` API. You can use this to set headers, method (GET, POST, etc.), and other fetch options.
  - Optional.
- **dependencyArray**: `any[]` (optional)
  - An optional array of dependencies that, when changed, will trigger a refetch.
  - Optional.

## Returns

The hook returns an object with the following properties:

- **data**: `T | null`
  - The data fetched from the API. The type `T` is a generic type parameter that you specify when using the hook. It will be null if no data is fetched or if there was an error.
- **isLoading**: `boolean`
  - A boolean value indicating whether the data is currently being fetched. It is `true` while the fetch is in progress and `false` otherwise.
- **error**: `Error | null`
  - An error object if an error occurred during the fetch process, otherwise `null`.

## How it Works

The `useLocationBasedFetch` hook internally does the following:

1.  **Geolocation:** It uses the `navigator.geolocation.getCurrentPosition` method to request the user's current location.
2.  **URL Construction:** Once the location is obtained, it constructs a complete URL by appending the latitude and longitude to the provided `baseUrl`. The latitude and longitude are added as query parameters, typically as `?lat=<latitude>&lon=<longitude>`.
3.  **Fetch Request:** It then uses the `fetch` API to send a request to the constructed URL.
4.  **Data Handling:** It parses the response data and stores it in a state variable. It also manages `isLoading` and `error` states to provide feedback on the status of the fetch operation.
5.  **Dependency array**: it will use the given dependency array to re fetch when the changes are happend.
6.  **React Hooks:** It uses `useState` to manage the `data`, `isLoading`, and `error` states, `useEffect` to manage the fetch logic, and `useCallback` for better performance.
7.  **Cleanup**: If the component is unmounted while the request is pending, it will abort the request.
8.  **Error Handling**: It gracefully handles error, updating the state to show there is an error.
9.  **Reasoning Behind Implementation Choices**: this hook was created to simplify the process of fetching data based on user's location.
