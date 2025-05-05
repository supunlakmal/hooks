# useImageOnLoad

A React hook to track the loading status, potential errors, and natural dimensions of an image element.

## Usage

This hook doesn't render the image itself, but provides information about its loading process.

```tsx
import React, { useState } from 'react';
import { useImageOnLoad } from './hooks/useImageOnLoad'; // Adjust import path

function ImageLoader({ imageUrl }: { imageUrl: string }) {
  const { isLoading, error, naturalWidth, naturalHeight } = useImageOnLoad(imageUrl);

  return (
    <div>
      <h3>Image Status</h3>
      {isLoading && <p>Loading image...</p>}
      {error && <p style={{ color: 'red' }}>Error loading image: {typeof error === 'string' ? error : 'Unknown error'}</p>}
      {!isLoading && !error && (
        <div>
          <p>Image loaded successfully!</p>
          <p>Dimensions: {naturalWidth}x{naturalHeight}</p>
          {/* You can now render the image confidently */}
          <img src={imageUrl} alt="Loaded content" style={{ maxWidth: '100%' }} />
        </div>
      )}
    </div>
  );
}

function App() {
    const [url, setUrl] = useState('https://via.placeholder.com/150');

    return (
        <div>
            <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter image URL"
                style={{ width: '300px', marginBottom: '10px' }}
            />
            <ImageLoader imageUrl={url} />
            <ImageLoader imageUrl="https://invalid-url/image.jpg" /> {/* Example with error */}
        </div>
    );
}

export default App;
```

## API

`useImageOnLoad(src?: string): Readonly<ImageOnLoadResult>`

### Parameters

-   `src` (optional): The source URL of the image to track.

### Return Value (`ImageOnLoadResult`)

-   `isLoading: boolean`: True if the image is currently loading (or if `src` is undefined initially).
-   `error: Event | string | null`: An error event or message if loading failed, otherwise `null`.
-   `naturalWidth: number | null`: The intrinsic width of the image once loaded, otherwise `null`.
-   `naturalHeight: number | null`: The intrinsic height of the image once loaded, otherwise `null`.

### Notes

-   The hook creates an `Image` object in memory to track loading.
-   If the `src` prop changes, the loading state resets.
-   It handles cases where the image might already be cached by the browser.
