import React, { useState } from "react";
import usePagination  from "../../hooks/usePagination";

function PaginationExample() {
    const [currentPage, setCurrentPage] = useState(1);
    const { pages, goToPage } = usePagination({
        totalItems: 50,
        itemsPerPage: 5,
        currentPage,
        onPageChange: setCurrentPage,
    });

    return (
        <div>
            <h1>usePagination Example</h1>
            <p>Current Page: {currentPage}</p>
            <div>
                {pages.map((page) => (
                    <button
                        key={page}
                        onClick={() => goToPage(page)}
                        style={{ margin: "0 5px", fontWeight: page === currentPage ? "bold" : "normal" }}
                    >
                        {page}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default PaginationExample;