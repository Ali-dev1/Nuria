import { Link } from "react-router-dom";
import { Trash2, Plus, Minus, ArrowLeft, ShoppingCart as CartIcon } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice } from "@/lib/constants";
import { useState } from "react";
import { useSettings } from "@/hooks/useSettings";

const CartPage = () => {
  const { items, removeItem, updateQuantity, subtotal, clearCart, setPointsDiscount, pointsDiscount } = useCartStore();
  const { user, isAuthenticated } = useAuth();
  const { data: settings } = useSettings();
  
  const deliveryFeeThreshold = Number(settings?.free_delivery_threshold) || 10000;
  const deliveryFee = subtotal() >= deliveryFeeThreshold ? 0 : Number(settings?.delivery_fee) || 200;
  const discount = pointsDiscount ?? 0;
  const total = Math.max(0, subtotal() + deliveryFee - discount);
  const loyaltyEarned = Math.floor(total / 10);

  const { data: profile } = useQuery({
    queryKey: ["profile-loyalty", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("loyalty_points").eq("user_id", user!.id).maybeSingle();
      return data;
    },
    enabled: !!user,
  });

  const availablePoints = profile?.loyalty_points ?? 0;
  const maxRedeemable = Math.min(availablePoints, Math.floor(subtotal() / 10) * 100); // can't discount more than subtotal
  const [redeemInput, setRedeemInput] = useState("");

  const applyPoints = () => {
    const pts = Math.min(parseInt(redeemInput) || 0, maxRedeemable);
    if (pts < 100) return;
    const discountAmount = Math.floor(pts / 100) * 10;
    setPointsDiscount(discountAmount);
  };

  if (items.length === 0) {
    return (
      <div className="container-nuria py-16 text-center">
        <CartIcon className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
        <h1 className="font-display text-2xl font-bold text-[#1A1A1A]">Your cart is empty</h1>
        <p className="font-sans text-[#6B7280] mt-2">Looks like you haven't added any books yet</p>
        <Link
          to="/books"
          className="inline-flex items-center gap-2 mt-8 px-8 py-4 bg-[#1B4332] text-white font-sans font-semibold rounded-lg hover:brightness-90 transition-all text-sm shadow-sm"
        >
          Browse Books
        </Link>
      </div>
    );
  }

  return (
    <div className="container-nuria py-8">
      <Link to="/books" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> Continue shopping
      </Link>

      <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#1A1A1A] mb-8">
        Shopping Cart ({items.length} {items.length === 1 ? "item" : "items"})
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map(({ product, quantity }) => (
            <div key={product.id} className="flex gap-4 p-4 bg-card rounded-xl">
              <div className="w-20 h-28 bg-muted rounded-lg shrink-0 flex items-center justify-center overflow-hidden">
                {product.images?.[0] && product.images[0] !== "/placeholder.svg" ? (
                  <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[10px] text-muted-foreground/40 text-center px-1">{product.title}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <Link to={`/books/${product.slug}`} className="font-display font-semibold text-sm text-[#1A1A1A] hover:text-[#C2541A] transition-colors line-clamp-1">
                  {product.title}
                </Link>
                <p className="font-sans text-xs text-[#6B7280] mt-0.5">{product.author}</p>
                <p className="font-sans font-bold text-[#1B4332] mt-2 text-sm">{formatPrice(product.price)}</p>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2 border border-border rounded-lg">
                    <button
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      className="p-1.5 hover:bg-muted transition-colors rounded-l-lg"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-sm font-medium w-6 text-center">{quantity}</span>
                    <button
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      className="p-1.5 hover:bg-muted transition-colors rounded-r-lg"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(product.id)}
                    className="p-2 text-[#6B7280] hover:text-red-600 transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-card rounded-xl p-6 h-fit space-y-4 sticky top-24">
          <h3 className="font-display text-lg font-bold text-[#1A1A1A]">Order Summary</h3>
          <div className="space-y-3 font-sans text-sm">
            <div className="flex justify-between text-[#6B7280]">
              <span>Subtotal</span>
              <span className="text-[#1A1A1A] font-medium">{formatPrice(subtotal())}</span>
            </div>
            <div className="flex justify-between text-[#6B7280]">
              <span>Delivery</span>
              <span>{deliveryFee === 0 ? <span className="text-[#1B4332] font-semibold">FREE</span> : formatPrice(deliveryFee)}</span>
            </div>
            {deliveryFee > 0 && (
              <p className="text-[11px] text-[#C2541A] font-medium font-sans">Add {formatPrice(deliveryFeeThreshold - subtotal())} more for free delivery</p>
            )}
            {discount > 0 && (
              <div className="flex justify-between text-[#C2541A]">
                <span>Loyalty Discount</span>
                <span>-{formatPrice(discount)}</span>
              </div>
            )}
          </div>

          {/* Loyalty redemption */}
          {isAuthenticated && availablePoints >= 100 && (
            <div className="border border-border rounded-lg p-3 space-y-2">
              <p className="text-xs font-medium text-foreground">Redeem Loyalty Points</p>
              <p className="text-xs text-muted-foreground">You have <span className="font-bold text-secondary">{availablePoints}</span> points (100 pts = KSh 10 off)</p>
              {discount === 0 ? (
                <div className="flex gap-2">
                  <input
                    value={redeemInput}
                    onChange={(e) => setRedeemInput(e.target.value)}
                    placeholder={`Max ${maxRedeemable}`}
                    className="flex-1 px-2 py-1.5 border border-border rounded text-xs bg-background"
                    type="number"
                    min={100}
                    max={maxRedeemable}
                    step={100}
                  />
                  <button onClick={applyPoints} className="px-3 py-1.5 bg-secondary text-secondary-foreground text-xs font-medium rounded hover:opacity-90">Apply</button>
                </div>
              ) : (
                <button onClick={() => setPointsDiscount(0)} className="text-xs text-destructive hover:underline">Remove discount</button>
              )}
            </div>
          )}

          <div className="border-t border-[#E5E0D8] pt-4 flex justify-between font-sans font-bold text-[#1A1A1A]">
            <span>Total</span>
            <span className="text-lg">{formatPrice(total)}</span>
          </div>
          <div className="text-[11px] font-sans font-medium text-[#1B4332] bg-[#D1FAE5] px-3 py-2.5 rounded-lg flex items-center justify-center gap-2">
            🎁 You'll earn {loyaltyEarned} loyalty points
          </div>
          <Link
            to="/checkout"
            className="block w-full py-4 bg-[#1B4332] text-white font-sans font-bold rounded-lg hover:brightness-90 transition-all text-sm text-center shadow-lg"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
