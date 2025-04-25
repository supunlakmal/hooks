"use client"
import React, { useState } from "react";
import usePagination from "../../../../src/hooks/usePagination";

function PaginationExample() {
  const [currentPage, setCurrentPage] = useState(1);
  const {
    totalPages,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    canGoNextPage,
    canGoPreviousPage,
  } = usePagination({
    totalItems: 50,
    initialItemsPerPage: 5,
    initialPage: currentPage,
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    goToPage(page);
  };

  return (
    <div>
      <h1>usePagination Example</h1>
      <p>Current Page: {currentPage}</p>
      <div>
        <button onClick={goToPreviousPage} disabled={!canGoPreviousPage}>
          Previous
        </button>
        {Array.from({ length: totalPages }).map((_, index) => {
          const page = index + 1;
          return (
            <button key={page} onClick={() => handlePageChange(page)} style={{ margin: "0 5px", fontWeight: page === currentPage ? "bold" : "normal" }}>{page}</button>
          );
        })}
        <button onClick={goToNextPage} disabled={!canGoNextPage}>Next</button>
      </div>
    </div>
  );
}

export default PaginationExample;