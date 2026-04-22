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
    if (!isNaN(num) && num >= 5000) {
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
            <div className="aspect-[1.6/1] bg-[#1B4332] rounded-[3rem] p-12 text-white overflow-hidden shadow-[0_50px_100px_-20px_rgba(27,67,50,0.3)] flex flex-col justify-between transition-all duration-700 group-hover:rotate-y-6 group-hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
              <div className="absolute -right-20 -top-20 w-80 h-80 bg-[#A1440B]/20 rounded-full blur-[100px] group-hover:bg-[#A1440B]/30 transition-colors" />
              
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
              <h2 className="font-display text-4xl font-bold text-[#1A1A1A]">Surprise a Reader</h2>
              <p className="font-sans text-[#6B7280] text-lg">Select a value or enter a custom amount to share the joy of literature.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[10000, 20000, 30000, 50000].map((val) => (
                <button 
                  key={val} 
                  onClick={() => {
                    setAmount(val);
                    setCustomAmount("");
                  }}
                  className={`p-8 border rounded-[2rem] font-display text-2xl font-bold transition-all hover:-translate-y-1 ${amount === val && !customAmount ? "bg-[#FAF7F2] border-[#A1440B] text-[#1A1A1A]" : "bg-white border-[#E5E0D8] text-[#1A1A1A] hover:border-[#A1440B]"}`}
                >
                  <span className="text-sm font-sans block mb-1 opacity-70">KSh</span>
                  {val.toLocaleString()}
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <label htmlFor="gc-amount" className="text-[10px] font-bold uppercase tracking-widest text-[#6B7280] ml-2">Custom Amount (Min KSh 5,000)</label>
              <div className="relative">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-[#1A1A1A] font-bold font-sans">KSh</span>
                <input 
                  id="gc-amount"
                  type="text" 
                  value={customAmount}
                  onChange={handleCustomAmountChange}
                  placeholder="Enter amount..." 
                  className="w-full pl-16 pr-6 py-5 bg-white border border-[#E5E0D8] rounded-2xl focus:ring-4 focus:ring-[#A1440B]/5 focus:border-[#A1440B] transition-all outline-none text-xl font-display font-bold text-[#1A1A1A]" 
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-3 p-4 bg-[#1B4332]/5 rounded-2xl border border-[#1B4332]/10">
                <CheckCircle2 className="w-5 h-5 text-[#1B4332]" />
                <p className="text-sm font-sans font-medium text-[#1B4332]">Delivered instantly via email to the recipient</p>
              </div>
              <Button className="w-full py-10 bg-[#1B4332] text-white rounded-3xl font-sans font-bold text-xs uppercase tracking-[0.2em] shadow-2xl shadow-[#1B4332]/20 hover:bg-[#132c21]">
                Purchase Gift Card <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Balance Verification Section */}
        <section className="bg-white p-12 lg:p-24 rounded-[4rem] border border-[#E5E0D8] shadow-2xl shadow-black/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#FAF7F2] rounded-full -mr-48 -mt-48 pointer-events-none" />
          
          <div className="grid lg:grid-cols-12 gap-16 items-center relative z-10">
            <div className="lg:col-span-5 space-y-8">
              <span className="font-sans text-[12px] font-bold text-[#A1440B] uppercase tracking-[0.3em]">Quick Check</span>
              <h2 className="font-display text-5xl font-bold text-[#1A1A1A] leading-tight">Verify Your <br />Balance</h2>
              <p className="font-sans text-[#6B7280] text-lg leading-relaxed">
                Check the remaining value of your Nuria Gift Card. Simply enter your email and the unique voucher code to see your balance.
              </p>
            </div>

            <div className="lg:col-span-7">
              <form className="space-y-6 bg-[#FAF7F2] p-10 lg:p-14 rounded-[3.5rem] border border-[#E5E0D8]" onSubmit={(e) => e.preventDefault()}>
                <div className="space-y-2">
                  <label htmlFor="gc-email" className="text-[10px] font-bold uppercase tracking-widest text-[#6B7280] ml-2">Email Identity</label>
                  <div className="relative">
                    <input 
                      id="gc-email"
                      type="email" 
                      placeholder="you@domain.com" 
                      className="w-full pl-14 pr-6 py-5 bg-white border border-[#E5E0D8] rounded-2xl focus:ring-4 focus:ring-[#A1440B]/5 focus:border-[#A1440B] transition-all outline-none" 
                    />
                    <Mail className="w-5 h-5 text-[#A1440B] absolute left-6 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="gc-code" className="text-[10px] font-bold uppercase tracking-widest text-[#6B7280] ml-2">Voucher Code</label>
                  <div className="relative">
                    <input 
                      id="gc-code"
                      type="text" 
                      placeholder="NR-XXXX-XXXX-XXXX" 
                      className="w-full pl-14 pr-6 py-5 bg-white border border-[#E5E0D8] rounded-2xl focus:ring-4 focus:ring-[#A1440B]/5 focus:border-[#A1440B] transition-all outline-none" 
                    />
                    <CreditCard className="w-5 h-5 text-[#A1440B] absolute left-6 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <Button className="w-full py-8 bg-[#A1440B] hover:bg-[#A04415] text-white rounded-2xl font-sans font-bold text-xs uppercase tracking-widest shadow-xl shadow-[#A1440B]/10">
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
