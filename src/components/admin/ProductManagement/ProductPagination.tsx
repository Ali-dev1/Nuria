import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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

  return (
    <div className="flex justify-center mt-12 animate-in slide-in-from-top-4 duration-1000">
      <Pagination className="bg-white p-2 rounded-2xl border border-border shadow-xl shadow-primary/5">
        <PaginationContent className="gap-2">
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => setProductPage(p => Math.max(1, p - 1))}
              className={`${productPage === 1 ? "pointer-events-none opacity-20" : "cursor-pointer hover:bg-primary/10 text-primary"} border-none rounded-xl font-black uppercase tracking-widest text-[10px] px-6 transition-all`}
            />
          </PaginationItem>
          
          {Array.from({ length: Math.min(5, Math.ceil(productsData.totalCount / pageSize)) }).map((_, i) => (
            <PaginationItem key={`page-${i + 1}`}>
              <PaginationLink 
                onClick={() => setProductPage(i + 1)}
                isActive={productPage === i + 1}
                className={`cursor-pointer w-10 h-10 rounded-xl font-black text-xs transition-all ${
                  productPage === i + 1 
                  ? "bg-primary text-white shadow-lg shadow-primary/30 ring-0" 
                  : "hover:bg-muted border-none"
                }`}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext 
              onClick={() => setProductPage(p => p + 1)}
              className={`${productPage >= Math.ceil(productsData.totalCount / pageSize) ? "pointer-events-none opacity-20" : "cursor-pointer hover:bg-primary/10 text-primary"} border-none rounded-xl font-black uppercase tracking-widest text-[10px] px-6 transition-all`}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};
