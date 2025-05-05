import {
  useState,
  useEffect,
  useRef,
  useCallback,
  ReactNode,
  FunctionComponent,
} from 'react';
import { createPortal } from 'react-dom';

interface UsePortalOptions {
  id?: string;
  attributes?: Record<string, string>;
}

const defaultAttributes: Record<string, string> = {};

// Helper function to find or create the portal root element
const getOrCreatePortalRoot = (
  id: string,
  attributes: Record<string, string> = defaultAttributes
): { element: HTMLElement; created: boolean } => {
  if (typeof document === 'undefined') {
    // Cannot create on server
    return { element: null as any, created: false }; // Return null-like structure
  }

  let element = document.getElementById(id);
  let elementCreated = false;

  if (!element) {
    element = document.createElement('div');
    element.setAttribute('id', id);
    Object.entries(attributes).forEach(([key, value]) => {
      element!.setAttribute(key, value);
    });
    document.body.appendChild(element);
    elementCreated = true;
  }

  return { element, created: elementCreated };
};

/**
 * Custom hook to manage a React Portal.
 * Creates a div element under document.body with a specified id and attributes,
 * and returns a Portal component to render children into it.
 *
 * @param {UsePortalOptions} [options] - Configuration options.
 * @param {string} [options.id='react-portal-root'] - The id attribute for the portal container div.
 * @param {Record<string, string>} [options.attributes] - Additional HTML attributes to set on the portal container div.
 * @returns {FunctionComponent<{ children: ReactNode }>} A Portal component.
 */
export const usePortal = ({
  id = 'react-portal-root', // Default ID
  attributes = defaultAttributes,
}: UsePortalOptions = {}): FunctionComponent<{ children: ReactNode }> =>{
  const portalElementRef = useRef<HTMLElement | null>(null);
  const portalCreatedByHook = useRef<boolean>(false);

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const { element, created } = getOrCreatePortalRoot(id, attributes);
    portalElementRef.current = element;
    portalCreatedByHook.current = created;
    

    // Cleanup function
    return () => {
      // Only remove the element if this hook instance created it
      if (portalCreatedByHook.current && portalElementRef.current) {
        portalElementRef.current.remove();
      }
      // Reset refs/state on unmount
      portalElementRef.current = null;
      portalCreatedByHook.current = false;
     
    };
  }, [id, attributes]); // Re-run if id or attributes change
  const [isMounted, setIsMounted] = useState(!!portalElementRef.current);
  setIsMounted(!!portalElementRef.current)
  // The Portal component definition using useCallback for stability
  const Portal = useCallback(
    ({ children }: { children: ReactNode }): React.ReactPortal | null => {
      // Render children into the portal element using createPortal
      // Only render if mounted client-side and portal element exists
      if (isMounted && portalElementRef.current) {
        return createPortal(children, portalElementRef.current);
      }
      return null; // Render nothing if not ready
    },
    [isMounted, portalElementRef.current]
  );

  return Portal;
}
