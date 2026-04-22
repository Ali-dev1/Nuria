import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useProduct, useProducts } from "@/hooks/useProducts";
import { useWishlist } from "@/hooks/useWishlist";
import { useReviews, useAddReview } from "@/hooks/useReviews";
import { useAuthStore } from "@/store/authStore";
import { Skeleton } from "@/components/shared/Skeleton";
import { useState } from "react";
import { ProductImageGallery } from "@/components/books/ProductPage/ProductImageGallery";
import { ProductInfo } from "@/components/books/ProductPage/ProductInfo";
import { ProductTabs } from "@/components/books/ProductPage/ProductTabs";
import { RelatedProducts } from "@/components/books/ProductPage/RelatedProducts";

const ProductPage = () => {
  const { slug } = useParams();
  const { data: product, isLoading: productLoading } = useProduct(slug);
  const addItem = useCartStore((s) => s.addItem);
  const { user } = useAuthStore();
  const { wishlistIds, toggle } = useWishlist();
  const { data: reviews = [], isLoading: reviewsLoading } = useReviews(product?.id);
  const [activeTab, setActiveTab] = useState<"description" | "reviews" | "delivery">("description");
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const addReview = useAddReview();

  const { data: relatedData } = useProducts({
    category: product?.category,
    limit: 5,
  });

  const relatedProducts = relatedData?.products || [];
  const related = relatedProducts.filter((p) => p.id !== product?.id).slice(0, 4);
  const isLoading = productLoading || reviewsLoading;

  if (isLoading) {
    return (
      <div className="container-nuria py-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          <Skeleton className="aspect-[3/4] w-full max-w-md rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-nuria py-16 text-center">
        <h1 className="font-display text-2xl font-bold text-foreground">Book not found</h1>
        <Link to="/books" className="mt-4 inline-flex items-center gap-2 text-sm text-secondary hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to books
        </Link>
      </div>
    );
  }

  const loyaltyPoints = Math.floor(product.price / 10);

  return (
    <div className="container-nuria py-8">
      <Link to="/books" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to books
      </Link>

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        <ProductImageGallery product={product} />
        <ProductInfo 
          product={product} 
          loyaltyPoints={loyaltyPoints} 
          addItem={addItem} 
          user={user} 
          toggleWishlist={toggle} 
          wishlistIds={wishlistIds} 
        />
      </div>

      <ProductTabs 
        product={product} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        user={user} 
        reviews={reviews} 
        reviewsLoading={reviewsLoading} 
        newRating={newRating} 
        setNewRating={setNewRating} 
        newComment={newComment} 
        setNewComment={setNewComment} 
        addReview={addReview} 
      />

      <RelatedProducts related={related} />
    </div>
  );
};

export default ProductPage;
