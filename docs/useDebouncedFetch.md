# `useDebouncedFetch` Hook

## Description

`useDebouncedFetch` is a custom React hook that wraps the Fetch API and debounces the requests. This is useful for situations where you need to make API calls based on user input, but you don't want to flood the server with requests as the user types.

## Description

The `useDebouncedFetch` hook takes a URL and an options object as arguments, similar to the standard `fetch` function. It also accepts a `debounceTimeout` option to specify the delay before the request is made after the last change in dependencies. The hook returns an object containing the response data, loading state, and error object.