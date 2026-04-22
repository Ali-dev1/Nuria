import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle, Package, ArrowRight, Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { formatPrice } from "@/lib/constants";

const OrderConfirmationPage = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("id");
  const [rating, setRating] = useState<number>(0);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  const { data: order } = useQuery({
    queryKey: ["order-confirm", orderId],
    queryFn: async () => {
      if (!orderId) return null;
      const { data } = await supabase
        .from("orders")
        .select("*")
        .eq("id", orderId)
        .maybeSingle();
      return data;
    },
    enabled: !!orderId,
  });

  const orderNumber = orderId ? orderId.slice(0, 8).toUpperCase() : `NUR-${Date.now().toString(36).toUpperCase()}`;

  return (
    <div className="container-nuria py-20 max-w-lg text-center">
      <div className="w-20 h-20 bg-[#D1FAE5] rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
        <CheckCircle className="w-10 h-10 text-[#065F46]" />
      </div>
      <h1 className="font-display text-3xl font-bold text-[#1A1A1A]">Order Confirmed!</h1>
      <p className="font-sans text-sm text-[#6B7280] mt-3 leading-relaxed">Thank you for shopping with Nuria. Your literary journey is about to begin.</p>

      <div className="bg-white border border-[#E5E0D8] rounded-2xl p-8 mt-10 space-y-5 text-left shadow-sm">
        <div className="flex justify-between items-center text-[13px] font-sans">
          <span className="text-[#6B7280] font-medium">Order Number</span>
          <span className="font-mono font-bold text-[#1A1A1A] bg-[#FAF7F2] px-3 py-1 rounded-lg">#{orderNumber}</span>
        </div>
        {order && (
          <div className="flex justify-between items-center text-[13px] font-sans">
            <span className="text-[#6B7280] font-medium">Total Paid</span>
            <span className="font-bold text-[#1B4332] text-base">{formatPrice(Number(order.total))}</span>
          </div>
        )}
        <div className="flex justify-between items-center text-[13px] font-sans">
          <span className="text-[#6B7280] font-medium">Estimated Delivery</span>
          <span className="font-bold text-[#1A1A1A]">2-4 business days</span>
        </div>
        {order?.loyalty_points_earned && order.loyalty_points_earned > 0 && (
          <div className="flex items-center gap-3 text-xs font-sans font-bold text-[#1B4332] bg-[#D1FAE5] px-4 py-3 rounded-xl mt-2">
            🎁 You earned {order.loyalty_points_earned} loyalty points!
          </div>
        )}
      </div>

      {ratingSubmitted ? (
        <div className="bg-[#1B4332]/5 border border-[#1B4332]/20 rounded-2xl p-8 mt-8 space-y-2 text-center">
          <h3 className="font-display text-lg font-bold text-[#1B4332]">Thank you for your feedback!</h3>
          <p className="text-sm font-sans text-[#1B4332]/80">We appreciate your support.</p>
        </div>
      ) : (
        <div className="bg-[#FAF7F2] border border-[#E5E0D8] rounded-2xl p-8 mt-8 space-y-4 shadow-sm text-center">
          <h3 className="font-display text-lg font-bold text-[#1A1A1A]">How was your checkout experience?</h3>
          <p className="text-sm font-sans text-[#6B7280]">Your feedback helps us improve Nuria.</p>
          <div className="flex justify-center gap-2 pt-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button 
                key={star}
                onClick={() => { setRating(star); setTimeout(() => setRatingSubmitted(true), 600); }}
                onMouseEnter={() => setRating(star)}
                className="p-1 hover:scale-110 transition-transform"
              >
                <Star className={`w-8 h-8 ${rating >= star ? "fill-[#A1440B] text-[#A1440B]" : "text-[#E5E0D8]"}`} />
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
        <Link to="/account" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border-2 border-[#E5E0D8] text-[#1A1A1A] font-sans font-bold rounded-xl hover:bg-[#FAF7F2] transition-all text-sm">
          <Package className="w-4 h-4" /> View Orders
        </Link>
        <Link to="/books" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#1B4332] text-white font-sans font-bold rounded-xl hover:brightness-90 transition-all text-sm shadow-lg shadow-[#1B4332]/10">
          Continue Shopping <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
