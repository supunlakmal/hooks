import { useState, useEffect } from 'react';

type DocumentVisibilityState = 'visible' | 'hidden' | 'prerender' | 'unloaded';

function getVisibility(): DocumentVisibilityState | true {
  if (typeof document === "undefined") {
    return true; // Or handle server-side rendering differently if needed
  }
  return document.visibilityState;
}

function useDocumentVisibility(): DocumentVisibilityState | true {
  const [documentVisibility, setDocumentVisibility] = useState<DocumentVisibilityState | true>(getVisibility());

  function handleVisibilityChange() {
    setDocumentVisibility(getVisibility());
  }

  useEffect(() => {
    if (typeof document !== "undefined") {
      window.addEventListener('visibilitychange', handleVisibilityChange);
      return () => {
        window.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }
    // No-op for server-side rendering
    return undefined;
  }, []);

  return documentVisibility;
}

export default useDocumentVisibility;