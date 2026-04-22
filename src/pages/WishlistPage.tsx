import { useWishlist } from "@/hooks/useWishlist";
import { useProducts } from "@/hooks/useProducts";
import { BookCard } from "@/components/books/BookCard";
import { InfoPageLayout } from "@/components/layout/InfoPageLayout";
import { Skeleton } from "@/components/shared/Skeleton";
import { Link } from "react-router-dom";
import { HeartOff } from "lucide-react";

const WishlistPage = () => {
  const { wishlistIds, isLoading: isWishlistLoading } = useWishlist();
  
  const { data, isLoading: isProductsLoading } = useProducts({
    ids: wishlistIds,
    limit: 50
  });

  const products = data?.products || [];
  const isLoading = isWishlistLoading || isProductsLoading;

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-10">
          {['wsk1', 'wsk2', 'wsk3', 'wsk4'].map((id) => (
            <div key={id} className="space-y-4">
              <Skeleton className="aspect-[3/4] w-full rounded-2xl" />
              <Skeleton className="h-5 w-3/4 rounded-lg" />
              <Skeleton className="h-4 w-1/2 rounded-lg" />
            </div>
          ))}
        </div>
      );
    }
    if (products.length === 0) {
      return (
        <div className="text-center py-24 bg-white rounded-[2.5rem] border border-[#E5E0D8] shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#FAF7F2] rounded-bl-full" />
          <HeartOff className="w-16 h-16 mx-auto text-[#A1440B]/30 mb-6" />
          <h2 className="text-3xl font-display font-bold text-[#1A1A1A]">Your wishlist is empty</h2>
          <p className="font-sans text-[#6B7280] mt-4 max-w-sm mx-auto text-lg leading-relaxed">
            Explore our collection of 21,311 books and save the ones that catch your eye!
          </p>
          <Link 
            to="/books" 
            className="mt-10 inline-flex px-10 py-4 bg-[#1B4332] text-white rounded-2xl font-sans font-bold hover:brightness-95 transition-all shadow-xl shadow-[#1B4332]/20 uppercase tracking-widest text-xs"
          >
            Browse Collection
          </Link>
        </div>
      );
    }
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-10">
        {products.map((product) => (
          <BookCard key={product.id} product={product} />
        ))}
      </div>
    );
  };

  return (
    <InfoPageLayout 
      label="Saved for Later" 
      title="Your Wishlist"
      subtitle="Keep track of the books you want to read. Add them to your cart whenever you're ready."
    >
      {renderContent()}
    </InfoPageLayout>
  );
};

export default WishlistPage;
