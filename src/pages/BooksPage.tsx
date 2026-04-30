import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, X, Search as SearchIcon } from "lucide-react";
import { BookCard } from "@/components/books/BookCard";
import { CATEGORIES } from "@/lib/constants";
import { useProducts } from "@/hooks/useProducts";
import { Skeleton } from "@/components/shared/Skeleton";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "bestselling", label: "Bestselling" },
];

const BooksPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
  const searchQuery = searchParams.get("search") || "";
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [sort, setSort] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || "");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 32;

  const { data, isLoading } = useProducts({
    category: selectedCategory || undefined,
    search: searchQuery || undefined,
    page: currentPage,
    pageSize: pageSize,
    sort: sort,
  });

  const products = data?.products || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  // Sync local search when URL changes
  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  // Reset page when category or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (localSearch.trim()) {
      newParams.set("search", localSearch.trim());
    } else {
      newParams.delete("search");
    }
    setSearchParams(newParams);
  };

  let pageTitle = "All Books";
  const currentCategory = CATEGORIES.find((c) => c.slug === selectedCategory);
  if (currentCategory && selectedCategory !== "") {
    pageTitle = currentCategory.name;
  } else if (searchQuery) {
    pageTitle = `Search: ${searchQuery}`;
  }

  return (
    <div className="container-nuria py-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
            {pageTitle}
          </h1>
          <div className="w-[60px] h-[3px] bg-secondary mt-4 rounded-full" />
          <p className="font-sans text-muted-foreground mt-4 text-sm uppercase tracking-widest font-medium">
            {isLoading ? "Loading…" : `${totalCount.toLocaleString()} titles available`}
          </p>
        </div>

        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80 group">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-secondary transition-colors" />
          <input 
            type="text"
            placeholder="Search in collection..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-border rounded-2xl text-sm font-sans focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
          />
        </form>
      </div>

      {/* Mobile Category Strip */}
      <div className="lg:hidden -mx-4 px-4 mb-8 overflow-x-auto no-scrollbar scroll-smooth">
        <div className="flex items-center gap-2 pb-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap border transition-all ${
                selectedCategory === cat.slug 
                  ? "bg-primary text-white border-primary shadow-md" 
                  : "bg-white border-border text-muted-foreground"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 mb-8 bg-background p-4 rounded-2xl border border-border">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="lg:hidden flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors"
        >
          <SlidersHorizontal className="w-4 h-4" /> Filters
        </button>
        <div className="flex items-center gap-2 ml-auto">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-3 py-2 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-8">
        <aside className={`${showFilters ? "fixed inset-0 z-50 bg-background p-6 overflow-y-auto lg:relative lg:inset-auto lg:z-auto lg:p-0" : "hidden"} lg:block w-full lg:w-56 shrink-0`}>
          <div className="flex items-center justify-between lg:hidden mb-4">
            <h3 className="font-semibold text-lg">Filters</h3>
            <button onClick={() => setShowFilters(false)}><X className="w-5 h-5" /></button>
          </div>
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3">Category</h4>
              <div className="space-y-1.5">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => { setSelectedCategory(cat.slug); setShowFilters(false); }}
                    className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${selectedCategory === cat.slug ? "bg-primary text-white font-medium shadow-sm" : "text-muted-foreground hover:bg-primary/5 hover:text-primary"}`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <div className="flex-1">
          {(() => {
            if (isLoading) {
              return (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                  {['skel-1', 'skel-2', 'skel-3', 'skel-4', 'skel-5', 'skel-6', 'skel-7', 'skel-8'].map((id) => (
                    <div key={id} className="space-y-3">
                      <Skeleton className="aspect-[3/4] w-full rounded-lg" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  ))}
                </div>
              );
            }
            if (products.length === 0) {
              return (
                <div className="text-center py-16">
                  <p className="text-lg font-medium text-foreground">No books found</p>
                  <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters</p>
                  <button
                    onClick={() => setSelectedCategory("")}
                    className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              );
            }
            return (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
                  {products.map((product) => (
                    <BookCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination UI */}
                {totalPages > 1 && (
                  <div className="mt-12 flex items-center justify-center gap-2">
                    <button
                      onClick={() => {
                        setCurrentPage(prev => Math.max(1, prev - 1));
                        globalThis.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border border-border rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-muted transition-colors"
                    >
                      Previous
                    </button>
                    <div className="hidden sm:flex items-center gap-1 mx-2">
                      {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                        let pageNum = currentPage <= 3 ? i + 1 : currentPage + (i - 2);
                        if (pageNum > totalPages) pageNum = totalPages - (4 - i);
                        if (pageNum < 1) pageNum = i + 1;
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => {
                              setCurrentPage(pageNum);
                              globalThis.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                            className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 ${currentPage === pageNum ? "bg-primary text-white shadow-sm" : "text-muted-foreground hover:bg-primary/5 hover:text-primary"}`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>
                    <span className="text-sm text-muted-foreground mx-4 sm:hidden">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => {
                        setCurrentPage(prev => Math.min(totalPages, prev + 1));
                        globalThis.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border border-border rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-muted transition-colors"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
};

export default BooksPage;
