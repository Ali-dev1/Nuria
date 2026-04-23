import { useState } from "react";
import { InfoPageLayout } from "@/components/layout/InfoPageLayout";
import { Gift, Mail, CreditCard, Search, CheckCircle2, ArrowRight } from "lucide-react";
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

  return (
    <InfoPageLayout 
      label="The Perfect Gift"
      title="Nuria Gift Cards"
      subtitle="Give the gift of infinite stories. Our digital gift cards are redeemable across our entire 21,000+ catalog of books."
    >
      <div className="space-y-24">
        {/* Visual & Purchase Section */}
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Immersive Card Preview */}
          <div className="relative group perspective-1000">
            <div className="aspect-[1.6/1] bg-primary rounded-[3rem] p-12 text-white overflow-hidden shadow-[0_50px_100px_-20px_rgba(27,67,50,0.3)] flex flex-col justify-between transition-all duration-700 group-hover:rotate-y-6 group-hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
              <div className="absolute -right-20 -top-20 w-80 h-80 bg-secondary/20 rounded-full blur-[100px] group-hover:bg-secondary/30 transition-colors" />
              
              <div className="flex justify-between items-start relative z-10">
                <div className="space-y-1">
                  <h3 className="font-display text-4xl font-bold tracking-tight">Nuria</h3>
                  <p className="font-sans text-[9px] uppercase tracking-[0.4em] text-white/50">The Honest Store</p>
                </div>
              </div>

              <div className="relative z-10 space-y-4">
                <p className="font-sans text-[11px] font-bold uppercase tracking-[0.3em] text-white/40">Digital Gift Voucher</p>
                <div className="flex items-baseline gap-4">
                  <span className="text-6xl font-display font-bold">KSh {amount.toLocaleString()}</span>
                </div>
              </div>

              <div className="absolute bottom-12 right-12 z-10">
                <Gift className="w-12 h-12 text-white/10" />
              </div>
            </div>
            {/* Glossy Overlay */}
            <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-tr from-white/10 via-white/5 to-transparent pointer-events-none opacity-50 group-hover:opacity-80 transition-opacity" />
          </div>

          {/* Form & Selection */}
          <div className="space-y-10">
            <div className="space-y-4">
              <h2 className="font-display text-4xl font-bold text-foreground">Surprise a Reader</h2>
              <p className="font-sans text-muted-foreground text-lg">Select a value or enter a custom amount to share the joy of literature.</p>
            </div>

            <div className="grid grid-cols-2 gap-4" role="group" aria-label="Gift card denominations">
              {[10000, 20000, 30000, 50000].map((val) => (
                <button
                  key={val}
                  type="button"
                  role="radio"
                  aria-checked={amount === val && !customAmount}
                  aria-label={`${val.toLocaleString()} Kenyan Shillings gift card`}
                  onClick={() => {
                    setAmount(val);
                    setCustomAmount("");
                  }}
                  className={`p-8 border rounded-[2rem] font-display text-2xl font-bold transition-all hover:-translate-y-1 ${amount === val && !customAmount ? "bg-background border-secondary text-foreground" : "bg-white border-border text-foreground hover:border-secondary"}`}
                >
                  <span className="text-sm font-sans block mb-1 opacity-70">KSh</span>
                  {val.toLocaleString()}
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <label htmlFor="gc-amount" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-2">Custom Amount (Min KSh 5,000)</label>
              <div className="relative">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-foreground font-bold font-sans">KSh</span>
                <input 
                  id="gc-amount"
                  type="text" 
                  value={customAmount}
                  onChange={handleCustomAmountChange}
                  placeholder="Enter amount..." 
                  className="w-full pl-16 pr-6 py-5 bg-white border border-border rounded-2xl focus:ring-4 focus:ring-secondary/5 focus:border-secondary transition-all outline-none text-xl font-display font-bold text-foreground" 
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <p className="text-sm font-sans font-medium text-primary">Delivered instantly via email to the recipient</p>
              </div>
              <Button className="w-full py-10 bg-primary text-white rounded-3xl font-sans font-bold text-xs uppercase tracking-[0.2em] shadow-2xl shadow-primary/20 hover:bg-primary/90">
                Purchase Gift Card <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Balance Verification Section */}
        <section className="bg-white p-12 lg:p-24 rounded-[4rem] border border-border shadow-2xl shadow-black/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-background rounded-full -mr-48 -mt-48 pointer-events-none" />
          
          <div className="grid lg:grid-cols-12 gap-16 items-center relative z-10">
            <div className="lg:col-span-5 space-y-8">
              <span className="font-sans text-[12px] font-bold text-secondary uppercase tracking-[0.3em]">Quick Check</span>
              <h2 className="font-display text-5xl font-bold text-foreground leading-tight">Verify Your <br />Balance</h2>
              <p className="font-sans text-muted-foreground text-lg leading-relaxed">
                Check the remaining value of your Nuria Gift Card. Simply enter your email and the unique voucher code to see your balance.
              </p>
            </div>

            <div className="lg:col-span-7">
              <form className="space-y-6 bg-background p-10 lg:p-14 rounded-[3.5rem] border border-border" onSubmit={(e) => e.preventDefault()}>
                <div className="space-y-2">
                  <label htmlFor="gc-email" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-2">Email Identity</label>
                  <div className="relative">
                    <input 
                      id="gc-email"
                      type="email" 
                      placeholder="you@domain.com" 
                      className="w-full pl-14 pr-6 py-5 bg-white border border-border rounded-2xl focus:ring-4 focus:ring-secondary/5 focus:border-secondary transition-all outline-none" 
                    />
                    <Mail className="w-5 h-5 text-secondary absolute left-6 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="gc-code" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-2">Voucher Code</label>
                  <div className="relative">
                    <input 
                      id="gc-code"
                      type="text" 
                      placeholder="NR-XXXX-XXXX-XXXX" 
                      className="w-full pl-14 pr-6 py-5 bg-white border border-border rounded-2xl focus:ring-4 focus:ring-secondary/5 focus:border-secondary transition-all outline-none" 
                    />
                    <CreditCard className="w-5 h-5 text-secondary absolute left-6 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <Button className="w-full py-8 bg-secondary hover:bg-secondary/90 text-white rounded-2xl font-sans font-bold text-xs uppercase tracking-widest shadow-xl shadow-secondary/10">
                  <Search className="w-4 h-4 mr-2" /> Verify Remaining Balance
                </Button>
              </form>
            </div>
          </div>
        </section>
      </div>
    </InfoPageLayout>
  );
};

export default GiftCardPage;
