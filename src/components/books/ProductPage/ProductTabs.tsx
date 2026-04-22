import React from "react";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { Skeleton } from "@/components/shared/Skeleton";
import { toast } from "sonner";

interface ProductTabsProps {
  product: any;
  activeTab: "description" | "reviews" | "delivery";
  setActiveTab: React.Dispatch<React.SetStateAction<"description" | "reviews" | "delivery">>;
  user: any;
  reviews: any[];
  reviewsLoading: boolean;
  newRating: number;
  setNewRating: React.Dispatch<React.SetStateAction<number>>;
  newComment: string;
  setNewComment: React.Dispatch<React.SetStateAction<string>>;
  addReview: any;
}

export const ProductTabs: React.FC<ProductTabsProps> = ({
  product,
  activeTab,
  setActiveTab,
  user,
  reviews,
  reviewsLoading,
  newRating,
  setNewRating,
  newComment,
  setNewComment,
  addReview,
}) => {
  return (
    <div className="mt-12">
      <div className="flex border-b border-border gap-6">
        {(["description", "reviews", "delivery"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-sm font-sans font-medium capitalize transition-colors border-b-2 -mb-px ${
              activeTab === tab ? "border-[#1B4332] text-[#1A1A1A]" : "border-transparent text-[#6B7280] hover:text-[#1A1A1A]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="py-6">
        {activeTab === "description" && (
          <p className="text-muted-foreground leading-relaxed max-w-2xl">{product.description}</p>
        )}
        {activeTab === "reviews" && (
          <div className="space-y-8 max-w-2xl">
            {user ? (
              <div className="bg-[#FAF7F2] p-6 rounded-2xl border border-[#E5E0D8]">
                <h3 className="font-display font-bold text-lg mb-4">Write a Review</h3>
                <div className="flex gap-2 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} onClick={() => setNewRating(star)} className="focus:outline-none">
                      <Star className={`w-5 h-5 ${newRating >= star ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                    </button>
                  ))}
                </div>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your thoughts on this book..."
                  className="w-full p-4 bg-white border border-[#E5E0D8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 resize-none h-24 mb-4"
                />
                <button
                  disabled={addReview.isPending || !newComment.trim()}
                  onClick={() => {
                      if (!product) return;
                      addReview.mutate({ productId: product.id, rating: newRating, comment: newComment }, {
                          onSuccess: () => {
                              setNewComment("");
                              toast.success("Review submitted!");
                          }
                      });
                  }}
                  className="px-6 py-2.5 bg-[#1B4332] text-white font-bold rounded-lg text-xs uppercase tracking-widest hover:bg-[#1B4332]/90 disabled:opacity-50 transition-all"
                >
                  {addReview.isPending ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            ) : (
              <div className="bg-muted/30 p-4 rounded-xl text-sm text-muted-foreground italic border border-dashed border-border">
                Please <Link to="/login" className="text-[#A1440B] font-bold hover:underline">sign in</Link> to leave a review.
              </div>
            )}

            <div className="space-y-6 pt-4">
              {reviewsLoading ? (
                Array.from({ length: 3 }).map((_, i) => <Skeleton key={`skeleton-${i}`} className="h-24 w-full rounded-xl" />)
              ) : reviews.length === 0 ? (
                <p className="text-muted-foreground italic">No reviews yet. Be the first to share your thoughts!</p>
              ) : (
                reviews.map((review) => (
                  <div key={review.id} className="border-b border-border pb-6 last:border-0 hover:bg-[#FAF7F2]/50 p-4 rounded-xl transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-[#1A1A1A]">{review.profiles?.name || "Anonymous Reader"}</span>
                      <span className="text-[10px] text-muted-foreground uppercase tracking-widest">{new Date(review.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex gap-0.5 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className={`w-3 h-3 ${review.rating >= star ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`} />
                      ))}
                    </div>
                    <p className="text-sm text-[#6B7280] leading-relaxed italic">"{review.comment}"</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
        {activeTab === "delivery" && (
          <div className="space-y-3 text-sm font-sans text-[#6B7280] max-w-lg">
            <p><span className="font-medium text-[#1A1A1A]">Nairobi:</span> 1-2 business days — KSh 200</p>
            <p><span className="font-medium text-[#1A1A1A]">Rest of Kenya:</span> 3-5 business days — KSh 350</p>
            <p><span className="font-medium text-[#1A1A1A]">Free delivery</span> within Nairobi for orders above KSh 10,000</p>
          </div>
        )}
      </div>
    </div>
  );
};
