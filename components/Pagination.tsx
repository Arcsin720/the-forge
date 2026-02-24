import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const Pagination = React.forwardRef<
  HTMLDivElement,
  PaginationProps
>(({ currentPage, totalPages, onPageChange, className = '' }, ref) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const maxVisiblePages = 5;
  
  let visiblePages = pages;
  if (totalPages > maxVisiblePages) {
    if (currentPage <= 3) {
      visiblePages = pages.slice(0, maxVisiblePages);
    } else if (currentPage > totalPages - 3) {
      visiblePages = pages.slice(-maxVisiblePages);
    } else {
      visiblePages = pages.slice(currentPage - 3, currentPage + 2);
    }
  }

  return (
    <div ref={ref} className={`flex items-center justify-center gap-1 ${className}`}>
      {/* Previous */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg border border-forge-border/30 text-slate-400 hover:text-slate-200 hover:border-forge-accent/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Previous page"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Pages */}
      {visiblePages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`min-w-[2.5rem] h-10 rounded-lg font-medium text-sm transition-colors ${
            currentPage === page
              ? 'bg-forge-accent text-black border border-forge-accent'
              : 'border border-forge-border/30 text-slate-300 hover:border-forge-accent/50 hover:text-slate-200'
          }`}
        >
          {page}
        </button>
      ))}

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg border border-forge-border/30 text-slate-400 hover:text-slate-200 hover:border-forge-accent/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Next page"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
});

Pagination.displayName = 'Pagination';
