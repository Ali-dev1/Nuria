import { useParams, Link } from "react-router-dom";
import { ArrowLeft, BookOpen } from "lucide-react";
import { BookCard } from "@/components/books/BookCard";
import type { Product } from "@/lib/types";

import { useAuthor } from "@/hooks/useAuthors";
import { useProducts } from "@/hooks/useProducts";
import { Skeleton } from "@/components/shared/Skeleton";

const AuthorPage = () => {
  const { slug } = useParams();
  const { data: author, isLoading: loadingAuthor } = useAuthor(slug);
  const { data: productsData, isLoading: loadingProducts } = useProducts({ 
    author: author?.name,
    pageSize: 20 
  });

  const books = productsData?.products || [];

  if (loadingAuthor) {
    return (
      <div className="container-nuria py-20">
        <Skeleton className="h-[400px] w-full rounded-[2rem]" />
      </div>
    );
  }

  if (!author) {
    return (
      <div className="container-nuria py-32 text-center">
        <h2 className="text-3xl font-bold font-display text-primary">Author not found</h2>
        <Link to="/" className="text-[#A1440B] font-bold uppercase text-[10px] tracking-widest mt-4 inline-block hover:underline">
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header Profile Section */}
      <section className="bg-[#FAF7F2] border-b border-[#E5E0D8] pt-16 pb-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#1B4332]/5 rounded-full -mr-48 -mt-48 blur-3xl pointer-events-none" />
        <div className="container-nuria relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-sans font-bold uppercase tracking-widest text-[#6B7280] hover:text-[#A1440B] transition-colors mb-12">
            <ArrowLeft className="w-4 h-4" /> Back to Store
          </Link>
          
          <div className="flex flex-col lg:flex-row gap-16 lg:items-center">
            <div className="w-48 h-48 sm:w-64 sm:h-64 rounded-full overflow-hidden shrink-0 border-4 border-white shadow-xl">
              <img 
                src={author.photo_url?.includes("unsplash.com") ? `${author.photo_url}&fm=webp&q=60&w=400` : author.photo_url} 
                alt={author.name} 
                loading="eager"
                fetchPriority="high"
                className="w-full h-full object-cover" 
              />
            </div>
            
            <div className="space-y-6 max-w-3xl">
              <div className="flex flex-wrap gap-2 mb-4">
                {(author.tags || []).map((tag: string) => (
                  <span key={tag} className="px-3 py-1 bg-white border border-[#E5E0D8] rounded-full text-[10px] font-sans font-bold uppercase tracking-widest text-[#1B4332]">
                    {tag}
                  </span>
                ))}
              </div>
              <h1 className="font-display text-4xl sm:text-6xl font-bold text-[#1A1A1A] leading-tight">
                {author.name}
              </h1>
              <p className="font-sans text-[#6B7280] text-lg leading-relaxed">
                {author.bio}
              </p>
              
              <div className="pt-4 flex items-center gap-6">
                <div className="flex flex-col">
                  <span className="font-display font-bold text-2xl text-[#1A1A1A]">
                    {loadingProducts ? "..." : books.length}
                  </span>
                  <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-[#6B7280]">Published Works</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Author Books grid */}
      <section className="container-nuria py-20 bg-background relative z-20 -mt-8">
        <div className="flex items-center gap-3 mb-10">
          <BookOpen className="w-6 h-6 text-[#1B4332]" />
          <h2 className="font-display text-3xl font-bold text-[#1A1A1A]">Books by {author.name.split(' ')[0]}</h2>
        </div>
        
        {loadingProducts ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {['ask1', 'ask2', 'ask3', 'ask4'].map(id => <Skeleton key={id} className="h-[300px] rounded-xl" />)}
          </div>
        ) : books.length === 0 ? (
          <p className="text-muted-foreground italic">No books found in our catalog for this author.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
            {books.map((product) => (
              <BookCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default AuthorPage;
