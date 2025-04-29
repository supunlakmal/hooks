import { useState, useEffect } from 'react';

type VisibilityState = 'visible' | 'hidden' | 'prerender' | 'unloaded';

const useDocumentVisibility = (): VisibilityState => {
  const [visibility, setVisibility] = useState<VisibilityState>(
    document.visibilityState
  );

  useEffect(() => {
    const handleVisibilityChange = () => {
      setVisibility(document.visibilityState);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return visibility;
};

export default useDocumentVisibility;