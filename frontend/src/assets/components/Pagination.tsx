import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    onPageChange?.(page);
  };

  const renderPages = () => {
    const pages: (number | "dots")[] = [];

    pages.push(1);

    if (currentPage > 3) {
      pages.push("dots");
    }

    for (
      let i = currentPage - 1;
      i <= currentPage + 1;
      i++
    ) {
      if (i > 1 && i < totalPages) {
        pages.push(i);
      }
    }

    if (currentPage < totalPages - 2) {
      pages.push("dots");
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const pages = renderPages();

  return (
    <nav className="flex items-center justify-center space-x-2 py-8">
      {/* Anterior */}
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
      >
        <ChevronLeft className="w-5 h-5 text-gray-600" />
      </button>

      {pages.map((item, index) => {
        if (item === "dots") {
          return (
            <span key={index} className="px-2 text-gray-400">
              <MoreHorizontal className="w-4 h-4" />
            </span>
          );
        }

        const isActive = item === currentPage;

        return (
          <button
            key={item}
            onClick={() => handlePageChange(item)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition
              ${
                isActive
                  ? "bg-blue-600 text-white shadow-sm"
                  : "border border-gray-300 hover:bg-gray-50"
              }`}
          >
            {item}
          </button>
        );
      })}

      {/* Próximo */}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
      >
        <ChevronRight className="w-5 h-5 text-gray-600" />
      </button>
    </nav>
  );
}