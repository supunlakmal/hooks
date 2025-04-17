# `useDerivedState`

A hook to compute derived state based on other values (like props or other state variables), recomputing only when specified dependencies change. This hook is essentially a semantic wrapper around `React.useMemo` to make the intent of deriving state clearer.

## Usage

Provide a factory function that calculates the desired state and an array of dependencies.

```tsx
import React, { useState } from "react";
import { useDerivedState } from "your-hooks-library"; // Adjust import path

interface User {
  id: number;
  firstName: string;
  lastName: string;
  isAdmin: boolean;
}

const UserProfile: React.FC<{ user: User }> = ({ user }) => {
  // Derive fullName only when user.firstName or user.lastName changes
  const fullName = useDerivedState(() => {
    console.log("[Derived State] Calculating fullName...");
    return `${user.firstName} ${user.lastName}`;
  }, [user.firstName, user.lastName]);

  // Derive permissions string only when user.isAdmin changes
  const permissions = useDerivedState(() => {
    console.log("[Derived State] Calculating permissions...");
    return user.isAdmin ? "Admin" : "User";
  }, [user.isAdmin]);

  // This state change should NOT trigger fullName or permissions recalculation
  const [lastLogin, setLastLogin] = useState(Date.now());

  return (
    <div>
      <h3>User Profile</h3>
      <p>ID: {user.id}</p>
      <p>Full Name: {fullName}</p>
      <p>Permissions: {permissions}</p>
      <p>Last Login: {new Date(lastLogin).toLocaleTimeString()}</p>
      {/* Button to force a re-render without changing dependencies */}
      <button onClick={() => setLastLogin(Date.now())}>
        Update Last Login (Force Render)
      </button>
    </div>
  );
};

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User>({
    id: 1,
    firstName: "Jane",
    lastName: "Doe",
    isAdmin: false,
  });

  const updateUser = () => {
    setCurrentUser((prev) => ({ ...prev, firstName: "Janet" }));
  };

  const toggleAdmin = () => {
    setCurrentUser((prev) => ({ ...prev, isAdmin: !prev.isAdmin }));
  };

  return (
    <div>
      <UserProfile user={currentUser} />
      <button onClick={updateUser}>Change First Name</button>
      <button onClick={toggleAdmin}>Toggle Admin Status</button>
      <p>Check console logs to see when derived state recalculates.</p>
    </div>
  );
};

export default App;
```

## API

### `useDerivedState<T>(factoryFn: () => T, dependencies: DependencyList): T`

#### Generics

- `T`: The type of the state being derived.

#### Parameters

- `factoryFn` (`() => T`, required): A function that takes no arguments and returns the computed derived state value.
- `dependencies` (`DependencyList`, required): An array of values. The `factoryFn` will only be re-executed if one of the values in this array has changed since the last render (compared using `Object.is`). Similar to the dependency arrays in `useEffect`, `useCallback`, and `useMemo`.

#### Returns

- `T`: The memoized derived state value. It will be the same value as the previous render unless one of the `dependencies` changed.

## How it Works

This hook is a direct wrapper around `React.useMemo(factoryFn, dependencies)`. It provides no additional functionality but serves to explicitly label the intention of deriving state in a memoized way.

## Use Cases

- Computing complex values based on props or state (e.g., filtering/sorting lists, calculating display strings).
- Avoiding expensive calculations on every render when the underlying data hasn't changed.
- Improving performance by memoizing values passed down as props to child components, especially when combined with `React.memo`.
