import { useState } from "react";
import { InfoPageLayout } from "@/components/layout/InfoPageLayout";
import { Mail, CreditCard, Search, CheckCircle2, ArrowRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

const GiftCardPage = () => {
  const [amount, setAmount] = useState<number>(10000);
  const [customAmount, setCustomAmount] = useState<string>("");

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "");
    setCustomAmount(val);
    const num = Number.parseInt(val, 10);
    if (!Number.isNaN(num) && num >= 5000) {
      setAmount(num);
    } else if (val === "") {
      setAmount(10000);
    }
  };

  const denominations = [
    { value: 5000, label: "Starter" },
    { value: 10000, label: "Classic" },
    { value: 20000, label: "Premium" },
    { value: 50000, label: "Ultimate" },
  ];

  return (
    <InfoPageLayout 
      label="Gift Cards"
      title="Give the Gift of Reading"
      subtitle="Digital gift cards redeemable across our entire 23,000+ catalog. Delivered instantly by email."
    >
      <div className="space-y-16 md:space-y-24">
        {/* Purchase Section */}
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Card Preview */}
          <div className="order-2 lg:order-1">
            <div className="aspect-[1.6/1] bg-primary rounded-2xl md:rounded-3xl p-6 sm:p-8 md:p-10 text-white overflow-hidden relative flex flex-col justify-between shadow-xl">
              {/* Background decoration */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
              <div className="absolute -right-16 -top-16 w-56 h-56 bg-white/5 rounded-full" />
              <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full" />
              
              {/* Top */}
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">Nuria</h3>
                  <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-white/50 mt-0.5">Home of African Books</p>
                </div>
                <BookOpen className="w-6 h-6 text-white/20" />
              </div>

              {/* Bottom */}
              <div className="relative z-10 space-y-1">
                <p className="text-[10px] sm:text-xs font-medium uppercase tracking-widest text-white/40">Digital Gift Card</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl md:text-5xl font-display font-bold">
                    KSh {amount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="order-1 lg:order-2 space-y-6 sm:space-y-8">
            <div className="space-y-2">
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">Choose an Amount</h2>
              <p className="text-muted-foreground text-sm sm:text-base">Select a denomination or enter a custom amount.</p>
            </div>

            {/* Denomination Grid */}
            <div className="grid grid-cols-2 gap-3" role="group" aria-label="Gift card denominations">
              {denominations.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  role="radio"
                  aria-checked={amount === value && !customAmount}
                  aria-label={`${value.toLocaleString()} Kenyan Shillings gift card`}
                  onClick={() => {
                    setAmount(value);
                    setCustomAmount("");
                  }}
                  className={`p-4 sm:p-5 border rounded-xl sm:rounded-2xl text-left transition-all active:scale-[0.98] ${
                    amount === value && !customAmount 
                      ? "bg-primary/5 border-primary ring-1 ring-primary/20" 
                      : "bg-white border-border hover:border-primary/30"
                  }`}
                >
                  <span className="text-[10px] sm:text-xs text-muted-foreground font-medium block mb-1">{label}</span>
                  <span className="text-lg sm:text-xl md:text-2xl font-display font-bold text-foreground">
                    KSh {value.toLocaleString()}
                  </span>
                </button>
              ))}
            </div>

            {/* Custom Amount */}
            <div className="space-y-2">
              <label htmlFor="gc-amount" className="text-xs font-medium text-muted-foreground">
                Custom Amount (Min KSh 5,000)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">KSh</span>
                <input 
                  id="gc-amount"
                  type="text" 
                  value={customAmount}
                  onChange={handleCustomAmountChange}
                  placeholder="Enter amount" 
                  className="w-full pl-14 pr-4 py-3.5 sm:py-4 bg-white border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-lg font-display font-bold text-foreground" 
                />
              </div>
            </div>

            {/* Info + CTA */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-xl border border-primary/10">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                <p className="text-sm font-medium text-primary">Delivered instantly to recipient's email</p>
              </div>
              <Button 
                onClick={() => {
                  import("sonner").then(({ toast }) => {
                    toast.success("Redirecting to checkout for your Gift Card...");
                  });
                }}
                className="w-full py-6 sm:py-7 bg-primary text-white rounded-xl sm:rounded-2xl font-semibold text-sm shadow-md hover:bg-primary/90 transition-all active:scale-[0.99]"
              >
                Purchase Gift Card <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Balance Check Section */}
        <section className="bg-white p-6 sm:p-8 md:p-12 lg:p-16 rounded-2xl md:rounded-3xl border border-border shadow-sm">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-4">
              <span className="text-xs font-semibold text-primary uppercase tracking-widest">Balance Check</span>
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-foreground leading-tight">
                Check Your Gift Card Balance
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                Enter your email and voucher code to check the remaining value on your Nuria gift card.
              </p>
            </div>

            <form className="space-y-4 bg-muted/20 p-5 sm:p-6 md:p-8 rounded-xl md:rounded-2xl border border-border" onSubmit={(e) => {
              e.preventDefault();
              import("sonner").then(({ toast }) => {
                toast.error("Voucher code not found. Please double check the characters and try again.");
              });
            }}>
              <div className="space-y-1.5">
                <label htmlFor="gc-email" className="text-xs font-medium text-muted-foreground">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2" />
                  <input 
                    id="gc-email"
                    type="email" 
                    placeholder="you@example.com" 
                    className="w-full pl-11 pr-4 py-3 bg-white border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-sm" 
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="gc-code" className="text-xs font-medium text-muted-foreground">Voucher Code</label>
                <div className="relative">
                  <CreditCard className="w-4 h-4 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2" />
                  <input 
                    id="gc-code"
                    type="text" 
                    placeholder="NR-XXXX-XXXX-XXXX" 
                    className="w-full pl-11 pr-4 py-3 bg-white border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-sm font-mono" 
                  />
                </div>
              </div>

              <Button type="submit" className="w-full py-5 bg-primary hover:bg-primary/90 text-white rounded-xl font-semibold text-sm shadow-sm transition-all active:scale-[0.99]">
                <Search className="w-4 h-4 mr-2" /> Check Balance
              </Button>
            </form>
          </div>
        </section>
      </div>
    </InfoPageLayout>
  );
};

export default GiftCardPage;
