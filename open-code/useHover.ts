import { useState, useRef, useEffect, RefObject } from "react";

/**
 * Custom hook to detect whether a DOM element is being hovered over.
 *
 * @returns {[RefObject<T | null>, boolean]} A tuple containing:
 *           - ref: A React ref object (possibly null initially) to attach to the target DOM element.
 *           - isHovered: A boolean state indicating if the element is currently hovered.
 */
function useHover<T extends HTMLElement = HTMLElement>(): [
  RefObject<T | null>,
  boolean
] {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const ref = useRef<T>(null);

  const handleMouseOver = () => setIsHovered(true);
  const handleMouseOut = () => setIsHovered(false);

  useEffect(
    () => {
      const node = ref.current;
      if (node) {
        node.addEventListener("mouseover", handleMouseOver);
        node.addEventListener("mouseout", handleMouseOut);

        // Return cleanup function
        return () => {
          node.removeEventListener("mouseover", handleMouseOver);
          node.removeEventListener("mouseout", handleMouseOut);
        };
      } else {
        // If node doesn't exist, return an empty cleanup function
        // to satisfy TypeScript
        return () => {};
      }
    },
    [] // Empty array ensures effect is only run on mount/unmount
  );

  // Use 'as const' for better tuple type inference
  return [ref, isHovered] as const;
}

export default useHover;
