# `useControlledRerenderState` Hook

## Description

The `useControlledRerenderState` hook provides a mechanism to manually trigger re-renders of a component based on an external condition or state change. It's particularly useful when you need fine-grained control over when a component updates, decoupling the rendering process from the standard React state update cycle. It can be use to control if a component must re-render.

## Usage

Here's how to use the `useControlledRerenderState` hook in a React component:

```typescript
import React, { useState } from 'react';
import { useControlledRerenderState } from '@supunlakmal/hooks'; // Adjust the import path

let externalCondition = false; // Simulate an external condition

function ControlledRerenderComponent() {
  const [componentKey, triggerRerender] = useControlledRerenderState(externalCondition);

  console.log(`Component rendering. Key: ${componentKey}, External Condition: ${externalCondition}`);

  // Simulate some complex logic or display that depends on the 'externalCondition'
  const content = externalCondition ? 'Content shown when condition is TRUE' : 'Content shown when condition is FALSE';

  return (
    <div key={componentKey}> {/* Using the key to force a full component remount if needed, though triggerRerender primarily works via state update */}
      <h1>useControlledRerenderState Example</h1>
      <p>Check the console logs to see when the component re-renders.</p>
      <p>{content}</p>
      <button
        onClick={() => {
          externalCondition = !externalCondition; // Toggle the external condition
          triggerRerender(externalCondition); // Inform the hook about the change
        }}
      >
        Toggle External Condition and Trigger Rerender
      </button>
    </div>
  );
}

export default ControlledRerenderComponent;
```

## API

### Types

```typescript
type TriggerRerender = (condition: boolean) => void;
```

### Parameters

- **condition**
  - Type: `boolean`
  - Description: A boolean value that determines whether a re-render should be triggered. When this value changes, the `shouldRerender` will be updated and the component will rerender.
  - Optional: No

### Returns

- **shouldRerender**
  - Type: `boolean`
  - Description: A boolean value that indicates if the component should render. It's updated when the `condition` changes.
- **triggerRerender**
  - Type: `TriggerRerender`
  - Description: A function that allows you to manually force a re-render of the component.

## How it Works

The `useControlledRerenderState` hook uses the `useState` hook internally to manage a state variable (`shouldRerender` or equivalent internal state). This internal state variable is updated whenever the `condition` parameter passed to the hook changes. By updating an internal state, the hook forces the component using it to re-render when the `condition` changes. The `triggerRerender` function returned by the hook also allows for manually triggering this state update (and thus a re-render) independent of the `condition` parameter.
