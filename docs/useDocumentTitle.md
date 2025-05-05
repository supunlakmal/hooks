# useDocumentTitle

Sets the document's title (`document.title`).

This hook updates the browser tab or window title. It also provides an option to automatically restore the original document title when the component using the hook unmounts.

## Usage

### Basic Usage

```jsx
import React from 'react';
import { useDocumentTitle } from '@supunlakmal/hooks'; // Adjust import path

function UserProfilePage({ userName }) {
  // Set the title based on the user's name
  useDocumentTitle(`Profile: ${userName}`);

  return (
    <div>
      <h1>{userName}'s Profile</h1>
      {/* ... profile content ... */}
    </div>
  );
}

export default UserProfilePage;
```

### Restoring Title on Unmount

```jsx
import React, { useState, useEffect } from 'react';
import { useDocumentTitle } from '@supunlakmal/hooks'; // Adjust import path

function TemporaryModal() {
  // Set a temporary title for the modal, restore original on close
  useDocumentTitle('Modal Open - Action Required', { restoreOnUnmount: true });

  useEffect(() => {
    console.log('Modal component mounted, title set.');
    return () => {
      console.log('Modal component unmounted, title restored.');
    };
  }, []);

  return (
    <div className="modal">
      <h2>Modal Content</h2>
      <p>This modal has its own document title.</p>
      {/* Close button would typically unmount this component */}
    </div>
  );
}

function App() {
  const [showModal, setShowModal] = useState(false);
  // Set the main app title
  useDocumentTitle('My Awesome App');

  return (
    <div>
      <h1>My Awesome App</h1>
      <button onClick={() => setShowModal(true)}>Open Modal</button>
      {showModal && <TemporaryModal />}
      {/* When modal closes (unmounts), title reverts to 'My Awesome App' */}
    </div>
  );
}

export default App;
```

## API

`useDocumentTitle(title, options?)`

### Parameters

- **`title`**: `string`
  - The string to set as the document's title.
- **`options`**: `object` (optional)
  An object containing configuration options:
  - `restoreOnUnmount?`: `boolean` - If `true`, the hook will store the current `document.title` when the component mounts and restore it when the component unmounts. Defaults to `false`.

### Returns

- `void` - This hook does not return any value.
