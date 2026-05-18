import React from 'react'

export default function Pagination({ currentPage, totalPages, onpageChange }) {
    // check if the current page is the first page
    const isFirstPage = currentPage === 1;

    // check if the current page is the last page
    const isLastPage = currentPage >= totalPages;

    // maximum number of page buttons to dispaly in pagination
    const maxPagesToShow = 5;

    // calculate the first page number to displa
    const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2))

    // calculate the last page number to displa
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1)

    // create an array of page numbers from start page to end page
    const pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i)

    return (
        <div className='flex justify-center items-center gap-2 py-6'>

            {/* previous button */}
            <button
                className={`px-4 py-2 rounded-md text-white font-semibold border border-[#252525]
                transition bg-black hover:bg-yellow-500 cursor-pointer disabled:cursor-not-allowed disabled:bg[#252525]`}
                disabled={isFirstPage}
                onClick={() => !isFirstPage && onpageChange(currentPage - 1)}
            >
                Previous
            </button>

            {/* page numbers */}
            {pages.map((page) => (
                <button
                    key={page}
                    onClick={() => onpageChange(page)}
                    className={`px-4 py-2 rounded-md text-white border border-[#252525] font-semibold transition
                    ${page === currentPage ? "bg-yellow-500" : "bg-black hover:bg-amber-500"}`}
                >
                    {page}
                </button>
            ))}

            {/* next button */}
            <button
                onClick={() => !isLastPage && onpageChange(currentPage + 1)}
                disabled={isLastPage}
                className={`px-4 py-2 rounded-md text-white font-semibold border border-[#252525]
                transition bg-black hover:bg-yellow-500 cursor-pointer disabled:cursor-not-allowed disabled:bg[#252525]`}
            >
                Next
            </button>

        </div>
    )
}
