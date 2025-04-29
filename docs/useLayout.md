# useLayout Hook Documentation

`useLayout` is a custom React hook designed to provide a flexible way to manage and render content within defined layout slots. It allows you to define named slots in your layout and inject content into them dynamically.

## Installation
```
bash
npm install @yoo-fe/hooks
```
## Usage
```
tsx
import React from 'react';
import { useLayout } from '@yoo-fe/hooks';

const MyLayout = () => {
  const layout = useLayout();

  return (
    <div className="container">
      <header>
        {layout.renderSlot('header')}
      </header>
      <main>
        {layout.renderSlot('main')}
      </main>
      <footer>
        {layout.renderSlot('footer')}
      </footer>
    </div>
  );
};

const MyComponent = () => {
  const layout = useLayout();

  React.useEffect(() => {
    layout.defineSlots({
      header: () => <h1>Header Content</h1>,
      main: () => <p>Main Content</p>,
      footer: () => <p>Footer Content</p>,
    });
  }, []);

  return (
      <div>
          {/* Other JSX */}
      </div>
  );
};

const MyComponent2 = () => {
  const layout = useLayout();

  React.useEffect(() => {
    layout.defineSlots({
        main2: () => <p>Main2 Content</p>,
    });
  }, []);

  return (
      <div>
          {/* Other JSX */}
      </div>
  );
};

const App = () => (
  <MyLayout>
      <MyComponent/>
      <MyComponent2/>
  </MyLayout>
);
```
## Parameters

The `useLayout` hook does not accept any parameters.

## Returns

The `useLayout` hook returns an object with the following methods:

-   **`defineSlots(slots: Slots)`**: Defines the slots with their corresponding content.
    -   **`slots`**: An object where keys are slot names (strings) and values are either React components or functions that return React components.

-   **`renderSlot(name: string)`**: Renders the content defined for a specific slot.
    -   **`name`**: The name of the slot to render.

-   **`addSlot(slotName: string, content: React.ReactNode)`**: Dynamically adds a new slot.
- **`removeSlot(slotName: string)`**: remove a specific slot.
-   **`clearSlots()`**: remove all slot
## Example

You can use this layout in your application like this:
```
tsx
import React from 'react';
import { useLayout } from '@yoo-fe/hooks';

const MyLayout = () => {
  const layout = useLayout();

  return (
    <div className="container">
      <header>
        {layout.renderSlot('header')}
      </header>
      <main>
        {layout.renderSlot('main')}
      </main>
      <footer>
        {layout.renderSlot('footer')}
      </footer>
    </div>
  );
};

const MyComponent = () => {
  const layout = useLayout();

  React.useEffect(() => {
    layout.defineSlots({
      header: () => <h1>Header Content</h1>,
      main: () => <p>Main Content</p>,
      footer: () => <p>Footer Content</p>,
    });
  }, []);

  return (
      <div>
          {/* Other JSX */}
      </div>
  );
};
const App = () => (
  <MyLayout>
      <MyComponent/>
  </MyLayout>
);
```
