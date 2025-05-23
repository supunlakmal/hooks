# Contributing

We welcome contributions to this library!

## Setting up the Development Environment

To get started, clone the repository and install the dependencies:

```bash
git clone https://github.com/supunlakmal/hooks.git
cd hooks
npm install
```

## Running Tests

To run the test suite, use the following command:

```bash
npm test
```

This will execute all tests using Jest.

### Writing Tests

Tests are located alongside the hooks in the `src/hooks` directory (e.g., `src/hooks/useCounter.test.ts`). We encourage contributors to add tests for new hooks or any new functionality added to existing hooks. Please ensure your tests cover the core functionality and any edge cases.

We use `@testing-library/react` for testing React hooks. Make sure to familiarize yourself with its API, especially `renderHook` and `act`.
