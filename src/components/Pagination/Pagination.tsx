interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  totalItems: number;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  totalItems,
}: PaginationProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getVisiblePages = () => {
    const pages = [];
    // Show fewer pages on mobile
    const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
    const maxPages = isMobile ? 5 : 7;
    const showEllipsis = totalPages > maxPages;

    if (!showEllipsis) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    pages.push(1);

    const startPage = Math.max(2, currentPage - (isMobile ? 1 : 2));
    const endPage = Math.min(totalPages - 1, currentPage + (isMobile ? 1 : 2));

    if (startPage > 2) {
      pages.push("...");
    }

    for (let i = startPage; i <= endPage; i++) {
      if (i !== 1 && i !== totalPages) {
        pages.push(i);
      }
    }

    if (endPage < totalPages - 1) {
      pages.push("...");
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col gap-3 px-3 py-4 bg-white border border-gray-200 rounded-lg sm:px-4">
      {/* Results info - more compact on mobile */}
      <div className="flex items-center justify-center text-xs sm:text-sm text-gray-600">
        <span className="text-center">
          <span className="sm:inline">Showing </span>
          <span className="font-medium">{startItem}</span>
          <span className="sm:inline"> to </span>
          <span className="font-medium">{endItem}</span>
          <span className="sm:inline"> of </span>
          <span className="font-medium">{totalItems}</span>
          <span className="sm:inline"> results</span>
        </span>
      </div>

      {/* Pagination controls */}
      <div className="flex items-center justify-center">
        <div className="flex items-center space-x-1">
          {/* Previous button - icon only on mobile */}
          <button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className="inline-flex items-center px-2 py-2 sm:px-3 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:text-gray-700 hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-500 transition-colors duration-200"
            aria-label="Go to previous page"
          >
            <svg
              className="w-4 h-4 sm:mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="hidden sm:inline">Previous</span>
          </button>

          {/* Page numbers */}
          <div className="flex items-center space-x-1">
            {getVisiblePages().map((page, index) => (
              <div key={index}>
                {page === "..." ? (
                  <span className="px-2 py-2 text-sm text-gray-500">...</span>
                ) : (
                  <button
                    onClick={() => onPageChange(page as number)}
                    className={`px-2 py-2 sm:px-3 text-sm font-medium rounded-md transition-colors duration-200 hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 min-w-[36px] ${
                      currentPage === page
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                    aria-label={`Go to page ${page}`}
                    aria-current={currentPage === page ? "page" : undefined}
                  >
                    {page}
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Next button - icon only on mobile */}
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="inline-flex items-center px-2 py-2 sm:px-3 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:text-gray-700 hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-500 transition-colors duration-200"
            aria-label="Go to next page"
          >
            <span className="hidden sm:inline">Next</span>
            <svg
              className="w-4 h-4 sm:ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
