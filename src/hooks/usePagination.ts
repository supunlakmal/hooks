import { useState, useCallback, useMemo, useEffect } from 'react';

interface UsePaginationProps {
  totalItems: number;
  initialPage?: number;
  initialItemsPerPage?: number;
}

interface UsePaginationReturn {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  startIndex: number; // 0-indexed
  endIndex: number; // 0-indexed
  canGoPreviousPage: boolean;
  canGoNextPage: boolean;
  goToPage: (pageNumber: number) => void;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  setItemsPerPage: (newItemsPerPage: number) => void;
}

/**
 * Custom hook for managing pagination state and controls.
 *
 * @param {UsePaginationProps} props - Configuration options.
 * @param {number} props.totalItems - The total number of items to paginate.
 * @param {number} [props.initialPage=1] - The initial page number (1-indexed).
 * @param {number} [props.initialItemsPerPage=10] - The initial number of items per page.
 * @returns {UsePaginationReturn} An object containing pagination state and control functions.
 */
export const usePagination = ({
  totalItems,
  initialPage = 1,
  initialItemsPerPage = 10,
}: UsePaginationProps): UsePaginationReturn => {
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [itemsPerPage, setItemsPerPageState] =
    useState<number>(initialItemsPerPage);

  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(totalItems / itemsPerPage));
  }, [totalItems, itemsPerPage]);

  // Ensure currentPage stays within valid bounds
  const validatedCurrentPage = useMemo(() => {
    return Math.max(1, Math.min(currentPage, totalPages));
  }, [currentPage, totalPages]);

  // Go to a specific page
  const goToPage = useCallback(
    (pageNumber: number) => {
      const newPage = Math.max(1, Math.min(pageNumber, totalPages));
      setCurrentPage(newPage);
    },
    [totalPages]
  );

  // Go to the next page
  const goToNextPage = useCallback(() => {
    goToPage(validatedCurrentPage + 1);
  }, [validatedCurrentPage, goToPage]);

  // Go to the previous page
  const goToPreviousPage = useCallback(() => {
    goToPage(validatedCurrentPage - 1);
  }, [validatedCurrentPage, goToPage]);

  // Set items per page (and reset to page 1)
  const setItemsPerPage = useCallback(
    (newItemsPerPage: number) => {
      setItemsPerPageState(Math.max(1, newItemsPerPage));
      // Reset to page 1 if current page is out of bounds with new itemsPerPage
      setCurrentPage(1);
    },
    [totalItems]
  );

  // Derived state
  const canGoPreviousPage = validatedCurrentPage > 1;
  const canGoNextPage = validatedCurrentPage < totalPages;
  const startIndex = (validatedCurrentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage - 1, totalItems - 1);

  // Effect to reset page if totalPages decreases below currentPage
  // This handles cases where itemsPerPage changes drastically or totalItems decreases
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  return {
    currentPage: validatedCurrentPage,
    totalPages,
    itemsPerPage,
    startIndex,
    endIndex,
    canGoPreviousPage,
    canGoNextPage,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    setItemsPerPage,
  };
};
