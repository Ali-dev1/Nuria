import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductPaginationProps {
  productsData: { totalCount: number } | undefined;
  pageSize: number;
  productPage: number;
  setProductPage: React.Dispatch<React.SetStateAction<number>>;
}

export const ProductPagination: React.FC<ProductPaginationProps> = ({
  productsData,
  pageSize,
  productPage,
  setProductPage,
}) => {
  if (!productsData || productsData.totalCount <= pageSize) {
    return null;
  }

  const totalPages = Math.ceil(productsData.totalCount / pageSize);

  // Generate visible page numbers with smart truncation
  const getVisiblePages = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (productPage > 3) pages.push("...");
      
      const start = Math.max(2, productPage - 1);
      const end = Math.min(totalPages - 1, productPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      
      if (productPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-between sm:justify-center gap-2 mt-6">
      <button
        onClick={() => setProductPage(p => Math.max(1, p - 1))}
        disabled={productPage === 1}
        className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed rounded-lg hover:bg-muted/50 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Prev</span>
      </button>
      
      <div className="flex items-center gap-1">
        {getVisiblePages().map((page) => (
          page === "..." ? (
            <span key={crypto.randomUUID()} className="px-2 text-muted-foreground text-sm">…</span>
          ) : (
            <button
              key={page}
              onClick={() => setProductPage(page)}
              className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                productPage === page 
                  ? "bg-primary text-white shadow-sm" 
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              }`}
            >
              {page}
            </button>
          )
        ))}
      </div>

      <button
        onClick={() => setProductPage(p => Math.min(totalPages, p + 1))}
        disabled={productPage >= totalPages}
        className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed rounded-lg hover:bg-muted/50 transition-colors"
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};
