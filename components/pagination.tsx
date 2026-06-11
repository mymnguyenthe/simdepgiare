import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}

export function Pagination({ currentPage, totalPages, baseUrl }: PaginationProps) {
  if (totalPages <= 1) return null;

  const getHref = (page: number) => {
    const separator = baseUrl.includes("?") ? "&" : "?";
    return `${baseUrl}${separator}page=${page}`;
  };

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    const delta = 2; // Number of pages to show on each side of current page

    // Always show first page
    pages.push(1);

    // Add ellipsis after first page if needed
    if (currentPage > delta + 2) {
      pages.push("...");
    }

    // Add pages around current page
    const start = Math.max(2, currentPage - delta);
    const end = Math.min(totalPages - 1, currentPage + delta);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Add ellipsis before last page if needed
    if (currentPage < totalPages - delta - 1) {
      pages.push("...");
    }

    // Always show last page (if different from first)
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="mt-12 flex items-center justify-center gap-2 flex-wrap">
      {/* Previous Button */}
      {currentPage > 1 && (
        <a
          href={getHref(currentPage - 1)}
          className="w-12 h-12 flex items-center justify-center rounded-lg border-2 border-gold-border bg-surface/50 text-text-secondary hover:neon-border-gold hover:neon-text-gold transition-all"
          aria-label="Previous page"
        >

        </a>
      )}

      {/* Page Numbers */}
      {pageNumbers.map((page, index) =>
        page === "..." ? (
          <span
            key={`ellipsis-${index}`}
            className="w-12 h-12 flex items-center justify-center text-text-muted"
          >
            ...
          </span>
        ) : (
          <a
            key={page}
            href={getHref(page)}
            className={cn(
              "w-12 h-12 flex items-center justify-center rounded-lg border-2 font-bold transition-all",
              page === currentPage
                ? "neon-border-gold bg-gold-glow/10 neon-text-gold"
                : "border-gold-border bg-surface/50 text-text-secondary hover:neon-border-gold hover:neon-text-gold"
            )}
          >
            {page}
          </a>
        )
      )}

      {/* Next Button */}
      {currentPage < totalPages && (
        <a
          href={getHref(currentPage + 1)}
          className="w-12 h-12 flex items-center justify-center rounded-lg border-2 border-gold-border bg-surface/50 text-text-secondary hover:neon-border-gold hover:neon-text-gold transition-all"
          aria-label="Next page"
        >
          ›
        </a>
      )}
    </div>
  );
}
