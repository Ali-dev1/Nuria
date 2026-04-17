import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Phone, CreditCard, Check, Loader2 } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useSettings } from "@/hooks/useSettings";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice } from "@/lib/constants";
import { toast } from "sonner";

type Step = "address" | "payment" | "confirm";

const CheckoutPage = () => {
  const { items, subtotal, clearCart } = useCartStore();
  const { user, isAuthenticated } = useAuth();
  const { profile, refetch: refetchProfile } = useProfile();
  const { data: settings } = useSettings();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("address");
  const [paymentMethod, setPaymentMethod] = useState<"mpesa" | "card">("mpesa");
  const [placing, setPlacing] = useState(false);
  const [address, setAddress] = useState({ name: "", phone: "", street: "", city: "" });
  const [mpesaPhone, setMpesaPhone] = useState("");

  // Loyalty redemption
  const pointsDiscount = useCartStore((s) => s.pointsDiscount);
  const deliveryFeeThreshold = Number(settings?.free_delivery_threshold) || 10000;
  const deliveryFee = subtotal() >= deliveryFeeThreshold ? 0 : Number(settings?.delivery_fee) || 200;
  const discount = pointsDiscount ?? 0;
  const total = Math.max(0, subtotal() + deliveryFee - discount);

  if (items.length === 0) {
    return (
      <div className="container-nuria py-16 text-center">
        <h1 className="font-display text-2xl font-bold text-foreground">No items to checkout</h1>
        <Link to="/books" className="mt-4 inline-block text-sm text-secondary hover:underline">Browse books</Link>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container-nuria py-16 text-center">
        <h1 className="font-display text-2xl font-bold text-foreground">Please sign in to checkout</h1>
        <Link to="/login" className="mt-4 inline-block px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg text-sm">Sign In</Link>
      </div>
    );
  }

  const placeOrder = async () => {
    if (!user) return;
    setPlacing(true);
    try {
      const loyaltyPointsEarned = Math.floor(total / 10);
      const pointsRedeemed = discount > 0 ? Math.round(discount / 10 * 100) : 0;

      // 1. Create order
      const { data: order, error: orderErr } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          total,
          delivery_fee: deliveryFee,
          payment_method: paymentMethod,
          status: "pending",
          loyalty_points_earned: loyaltyPointsEarned,
        })
        .select("id")
        .single();
      if (orderErr) throw orderErr;

      // 2. Create order items
      const orderItems = items.map(({ product, quantity }) => ({
        order_id: order.id,
        product_id: product.id,
        quantity,
        unit_price: product.price,
      }));
      const { error: itemsErr } = await supabase.from("order_items").insert(orderItems);
      if (itemsErr) throw itemsErr;

      // 3. Update product stock (decrease)
      for (const { product, quantity } of items) {
        await supabase
          .from("products")
          .update({ stock: Math.max(0, product.stock - quantity) })
          .eq("id", product.id);
      }

      // 4. Save address if provided
      if (address.name && address.street) {
        await supabase.from("addresses").insert({
          user_id: user.id,
          name: address.name,
          phone: address.phone,
          street: address.street,
          city: address.city,
          is_default: true,
        });
      }

      // 5. Loyalty points earned
      if (loyaltyPointsEarned > 0) {
        await supabase.from("loyalty_transactions").insert({
          user_id: user.id,
          points: loyaltyPointsEarned,
          type: "earned",
          order_id: order.id,
        });
      }

      // 6. Loyalty points redeemed
      if (pointsRedeemed > 0) {
        await supabase.from("loyalty_transactions").insert({
          user_id: user.id,
          points: -pointsRedeemed,
          type: "redeemed",
          order_id: order.id,
        });
      }

      // 7. Update profile loyalty balance
      const netPoints = loyaltyPointsEarned - pointsRedeemed;
      const { data: profile } = await supabase
        .from("profiles")
        .select("loyalty_points")
        .eq("user_id", user.id)
        .maybeSingle();
      const currentPoints = profile?.loyalty_points ?? 0;
      await supabase
        .from("profiles")
        .update({ loyalty_points: Math.max(0, currentPoints + netPoints) })
        .eq("user_id", user.id);

      // 8. Trigger M-Pesa STK Push if selected
      if (paymentMethod === "mpesa") {
        const { data: mpesaData, error: mpesaErr } = await supabase.functions.invoke("mpesa-stk", {
          body: {
            phone: mpesaPhone || address.phone,
            amount: total,
            orderId: order.id,
          },
        });

        if (mpesaErr) {
          console.error("M-Pesa Error:", mpesaErr);
          toast.error("Order placed, but M-Pesa prompt failed. Please pay manually.");
        } else if (mpesaData?.ResponseCode === "0") {
          toast.success("M-Pesa prompt sent! Check your phone.");
        }
      }

      clearCart();
      navigate(`/order-confirmation?id=${order.id}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to place order");
    } finally {
      setPlacing(false);
    }
  };

  const steps: { key: Step; label: string }[] = [
    { key: "address", label: "Delivery" },
    { key: "payment", label: "Payment" },
    { key: "confirm", label: "Confirm" },
  ];

  return (
    <div className="container-nuria py-8 max-w-3xl">
      <Link to="/cart" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to cart
      </Link>

      <h1 className="font-display text-2xl font-bold text-foreground mb-6">Checkout</h1>

      {/* Steps */}
      <div className="flex items-center gap-2 mb-10">
        {steps.map((s, i) => (
          <div key={s.key} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
              steps.findIndex((x) => x.key === step) >= i
                ? "bg-[#1B4332] text-white"
                : "bg-[#E5E0D8] text-[#6B7280]"
            }`}>
              {steps.findIndex((x) => x.key === step) > i ? <Check className="w-4 h-4" /> : i + 1}
            </div>
            <span className={`text-[13px] font-sans font-medium ${steps.findIndex((x) => x.key === step) >= i ? "text-[#1A1A1A]" : "text-[#6B7280]"}`}>
              {s.label}
            </span>
            {i < steps.length - 1 && <div className="w-8 h-px bg-[#E5E0D8]" />}
          </div>
        ))}
      </div>

      {step === "address" && (
        <div className="space-y-6 animate-fade-in">
          <h2 className="font-display text-lg font-bold text-[#1A1A1A]">Delivery Address</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="checkout-name" className="block text-[13px] font-sans font-medium text-[#1A1A1A] mb-1.5">Full Name</label>
              <input id="checkout-name" value={address.name} onChange={(e) => setAddress({ ...address, name: e.target.value })} className="w-full px-4 py-3 border border-[#E5E0D8] rounded-lg text-sm bg-white font-sans focus:outline-none focus:ring-2 focus:ring-[#1B4332]/30" placeholder="John Kamau" />
            </div>
            <div>
              <label htmlFor="checkout-phone" className="block text-[13px] font-sans font-medium text-[#1A1A1A] mb-1.5">Phone Number</label>
              <input id="checkout-phone" value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} className="w-full px-4 py-3 border border-[#E5E0D8] rounded-lg text-sm bg-white font-sans focus:outline-none focus:ring-2 focus:ring-[#1B4332]/30" placeholder="+254 712 345 678" />
            </div>
          </div>
          <div>
            <label htmlFor="checkout-street" className="block text-[13px] font-sans font-medium text-[#1A1A1A] mb-1.5">Street Address</label>
            <input id="checkout-street" value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} className="w-full px-4 py-3 border border-[#E5E0D8] rounded-lg text-sm bg-white font-sans focus:outline-none focus:ring-2 focus:ring-[#1B4332]/30" placeholder="123 Kenyatta Avenue" />
          </div>
          <div>
            <label htmlFor="checkout-city" className="block text-[13px] font-sans font-medium text-[#1A1A1A] mb-1.5">City</label>
            <input id="checkout-city" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} className="w-full px-4 py-3 border border-[#E5E0D8] rounded-lg text-sm bg-white font-sans focus:outline-none focus:ring-2 focus:ring-[#1B4332]/30" placeholder="Nairobi" />
          </div>
          <button
            onClick={() => setStep("payment")}
            className="w-full py-4 bg-[#1B4332] text-white font-sans font-bold rounded-lg hover:brightness-90 transition-all text-sm shadow-lg mt-4"
          >
            Continue to Payment
          </button>
        </div>
      )}

      {step === "payment" && (
        <div className="space-y-6 animate-fade-in">
          <h2 className="font-display text-lg font-bold text-[#1A1A1A]">Payment Method</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <button
              onClick={() => setPaymentMethod("mpesa")}
              className={`flex items-center gap-4 p-5 rounded-xl border-2 transition-all ${
                paymentMethod === "mpesa" ? "border-[#1B4332] bg-[#1B4332]/5" : "border-[#E5E0D8] hover:border-[#1B4332]/30"
              }`}
            >
              <div className={`p-2 rounded-lg transition-colors ${paymentMethod === "mpesa" ? "bg-[#1B4332] text-white" : "bg-[#FAF7F2] text-[#6B7280]"}`}>
                <Phone className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className={`font-sans font-bold text-sm transition-colors ${paymentMethod === "mpesa" ? "text-[#1B4332]" : "text-[#1A1A1A]"}`}>M-Pesa</p>
                <p className="text-[11px] font-sans text-[#6B7280]">Pay via STK Push</p>
              </div>
            </button>
            <button
              onClick={() => setPaymentMethod("card")}
              className={`flex items-center gap-4 p-5 rounded-xl border-2 transition-all ${
                paymentMethod === "card" ? "border-[#1B4332] bg-[#1B4332]/5" : "border-[#E5E0D8] hover:border-[#1B4332]/30"
              }`}
            >
              <div className={`p-2 rounded-lg transition-colors ${paymentMethod === "card" ? "bg-[#1B4332] text-white" : "bg-[#FAF7F2] text-[#6B7280]"}`}>
                <CreditCard className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className={`font-sans font-bold text-sm transition-colors ${paymentMethod === "card" ? "text-[#1B4332]" : "text-[#1A1A1A]"}`}>Card</p>
                <p className="text-[11px] font-sans text-[#6B7280]">Visa / Mastercard</p>
              </div>
            </button>
          </div>
          {paymentMethod === "mpesa" && (
            <div className="pt-2">
              <label htmlFor="checkout-mpesa" className="block text-[13px] font-sans font-medium text-[#1A1A1A] mb-1.5">M-Pesa Phone Number</label>
              <input id="checkout-mpesa" value={mpesaPhone} onChange={(e) => setMpesaPhone(e.target.value)} className="w-full px-4 py-3 border border-[#E5E0D8] rounded-lg text-sm bg-white font-sans focus:outline-none focus:ring-2 focus:ring-[#1B4332]/30" placeholder="0712 345 678" />
            </div>
          )}
          <div className="flex gap-4 pt-4">
            <button onClick={() => setStep("address")} className="px-8 py-3.5 border border-[#1B4332] text-[#1B4332] rounded-lg text-[13px] font-bold hover:bg-[#1B4332]/5 transition-all font-sans uppercase tracking-wider">Back</button>
            <button
              onClick={() => setStep("confirm")}
              className="flex-1 py-3.5 bg-[#1B4332] text-white font-sans font-bold rounded-lg hover:brightness-90 transition-all text-[13px] shadow-lg uppercase tracking-wider"
            >
              Review Order
            </button>
          </div>
        </div>
      )}

      {step === "confirm" && (
        <div className="space-y-8 animate-fade-in">
          <h2 className="font-display text-lg font-bold text-[#1A1A1A]">Order Summary</h2>
          <div className="space-y-4 bg-white rounded-xl p-6 shadow-sm border border-[#E5E0D8]">
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="flex justify-between items-center text-sm font-sans">
                <div className="flex flex-col">
                  <span className="text-[#1A1A1A] font-medium">{product.title}</span>
                  <span className="text-[#6B7280] text-xs">Qty: {quantity}</span>
                </div>
                <span className="font-bold text-[#1B4332]">{formatPrice(product.price * quantity)}</span>
              </div>
            ))}
            <div className="border-t border-[#E5E0D8] pt-4 space-y-3 text-[13px] font-sans">
              <div className="flex justify-between text-[#6B7280]"><span>Subtotal</span><span>{formatPrice(subtotal())}</span></div>
              <div className="flex justify-between text-[#6B7280]"><span>Delivery</span><span>{deliveryFee === 0 ? <span className="text-[#1B4332] font-semibold">FREE</span> : formatPrice(deliveryFee)}</span></div>
              {discount > 0 && (
                <div className="flex justify-between text-[#C2541A]"><span>Loyalty Discount</span><span>-{formatPrice(discount)}</span></div>
              )}
              <div className="flex justify-between font-bold text-[#1A1A1A] pt-2 text-base border-t border-[#E5E0D8]"><span>Total</span><span>{formatPrice(total)}</span></div>
            </div>
          </div>
          <div className="flex gap-4">
            <button onClick={() => setStep("payment")} className="px-8 py-3.5 border border-[#1B4332] text-[#1B4332] rounded-lg text-[13px] font-bold hover:bg-[#1B4332]/5 transition-all font-sans uppercase tracking-wider">Back</button>
            <button
              onClick={placeOrder}
              disabled={placing}
              className="flex-1 py-4 bg-[#C2541A] text-white font-sans font-bold rounded-lg hover:brightness-90 transition-all text-sm shadow-xl disabled:opacity-50 flex items-center justify-center gap-2 uppercase tracking-widest"
            >
              {placing && <Loader2 className="w-4 h-4 animate-spin" />}
              {paymentMethod === "mpesa" ? "Complete Order" : "Pay Now"} — {formatPrice(total)}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
