import { useState, useEffect, useRef } from 'react';

// Define the possible loading states for the script
type ScriptStatus = 'idle' | 'loading' | 'ready' | 'error';

// Options for the hook
interface UseScriptOptions {
  /** HTML attributes to set on the script element (e.g., async, defer, integrity, crossOrigin) */
  attrs?: Record<string, string | boolean>;
  /** Optional callback to run when the script successfully loads */
  onLoad?: () => void;
  /** Optional callback to run if the script fails to load */
  onError?: (error: Event | string) => void;
  /** If true, removes the script tag when the component unmounts. Defaults to true. */
  removeOnUnmount?: boolean;
}

/**
 * Hook to dynamically load an external script and track its loading state.
 *
 * @param src The source URL of the script to load. Pass null/undefined to unload or skip loading.
 * @param options Configuration options for loading and handling the script.
 * @returns The loading status of the script ('idle', 'loading', 'ready', 'error').
 */
export function useScript(
  src: string | null | undefined,
  options?: UseScriptOptions
): ScriptStatus {
  const [status, setStatus] = useState<ScriptStatus>(src ? 'loading' : 'idle');
  const optionsRef = useRef(options); // Ref to keep options up-to-date without triggering effect

  // Update optionsRef if options object changes identity
  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  useEffect(() => {
    if (!src) {
      setStatus('idle');
      return; // No source URL provided, do nothing
    }

    // Check if the script tag with this src already exists
    let script = document.querySelector(
      `script[src="${src}"]`
    ) as HTMLScriptElement | null;

    if (!script) {
      // Script doesn't exist, create and append it
      script = document.createElement('script');
      script.src = src;
      script.async = true; // Default to async

      // Apply custom attributes from options
      const currentAttrs = optionsRef.current?.attrs;
      if (currentAttrs) {
        Object.keys(currentAttrs).forEach((key) => {
          // Handle boolean attributes correctly
          if (typeof currentAttrs[key] === 'boolean') {
            if (currentAttrs[key]) {
              script?.setAttribute(key, ''); // Presence indicates true (e.g., async, defer)
            }
          } else {
            script?.setAttribute(key, currentAttrs[key] as string);
          }
        });
      }

      document.body.appendChild(script);
      setStatus('loading');
    } else if (script.getAttribute('data-status') === 'ready') {
      // Script already exists and is marked as ready by a previous instance of this hook
      setStatus('ready');
      optionsRef.current?.onLoad?.(); // Call onLoad if already ready
      return; // No need for event listeners if already loaded
    } else if (script.getAttribute('data-status') === 'error') {
      setStatus('error');
      optionsRef.current?.onError?.('Script previously failed to load.');
      return; // No need for event listeners if previously errored
    }
    // If script exists but status is unknown (or still loading), attach listeners

    // Event listeners
    const handleLoad = () => {
      script?.setAttribute('data-status', 'ready'); // Mark as ready for other hook instances
      setStatus('ready');
      optionsRef.current?.onLoad?.();
    };

    const handleError = (event: Event | string) => {
      script?.setAttribute('data-status', 'error'); // Mark as error
      setStatus('error');
      optionsRef.current?.onError?.(event);
    };

    script.addEventListener('load', handleLoad);
    script.addEventListener('error', handleError);

    // Cleanup function
    return () => {
      // Remove listeners
      script?.removeEventListener('load', handleLoad);
      script?.removeEventListener('error', handleError);

      // Optionally remove the script tag on unmount
      const shouldRemove = optionsRef.current?.removeOnUnmount ?? true;
      if (shouldRemove && script && document.body.contains(script)) {
        // Only remove if no other hook instance might still need it
        // Basic check: see if another identical script tag exists.
        // A more robust solution might involve reference counting if multiple
        // components load the same script with removeOnUnmount=true.
        const allScripts = document.querySelectorAll(`script[src="${src}"]`);
        if (allScripts.length === 1) {
          document.body.removeChild(script);
        }
      }
    };
  }, [src]); // Re-run effect only if src changes

  return status;
}
