import { InfoPageLayout } from "@/components/layout/InfoPageLayout";
import { Store, ListPlus, Truck, Wallet, CheckCircle2, BadgePercent, Package, ArrowRight, TrendingUp, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const VendorGuidePage = () => {
  return (
    <InfoPageLayout 
      label="Merchant Center" 
      title="Selling on Nuria"
      subtitle="Join Kenya's most forward-thinking digital marketplace for literature. We empower authors and publishers to reach their readers directly."
    >
      <div className="space-y-24">
        {/* 🚀 Partnership Value Prop */}
        <section className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-[#1A1A1A] leading-tight">
              A partnership built <br />on <span className="text-[#C2541A]">transparency.</span>
            </h2>
            <p className="font-sans text-xl text-[#6B7280] leading-relaxed">
              At Nuria, we believe creators deserve a fair share. We only earn when you sell — meaning zero listing fees and radical honesty in every payout.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 bg-white border border-[#E5E0D8] rounded-3xl space-y-3">
                <TrendingUp className="w-8 h-8 text-[#1B4332]" />
                <h4 className="font-bold text-[#1A1A1A]">No Monthly Fees</h4>
                <p className="text-sm text-[#6B7280]">Pay only when you make a sale.</p>
              </div>
              <div className="p-6 bg-white border border-[#E5E0D8] rounded-3xl space-y-3">
                <ShieldCheck className="w-8 h-8 text-[#1B4332]" />
                <h4 className="font-bold text-[#1A1A1A]">Author First</h4>
                <p className="text-sm text-[#6B7280]">Dedicated support for local creators.</p>
              </div>
            </div>
          </div>

          <div className="bg-[#1B4332] p-10 lg:p-16 rounded-[4rem] text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
            <div className="relative z-10 space-y-8 text-center lg:text-left">
              <div className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-3xl flex items-center justify-center border border-white/20 mx-auto lg:mx-0">
                <BadgePercent className="w-10 h-10 text-[#C2541A]" />
              </div>
              <div className="space-y-2">
                <h3 className="font-display text-3xl font-bold">Simple Commission</h3>
                <p className="font-sans text-white/70 leading-relaxed text-lg italic">
                  "Our commission structure is category-based and transparent. We process vendor payouts monthly via M-Pesa like clockwork."
                </p>
              </div>
              <Button 
                onClick={() => window.location.href = "/vendor/register"}
                className="w-full py-8 bg-[#C2541A] hover:bg-[#A04415] rounded-2xl font-bold uppercase tracking-widest text-xs border-none shadow-xl shadow-black/20"
              >
                Register as Vendor
              </Button>
            </div>
          </div>
        </section>

        {/* 🗺️ 6-Step Roadmap */}
        <section className="space-y-16">
          <div className="text-center space-y-4">
            <span className="font-sans text-[12px] font-bold text-[#C2541A] tracking-[0.3em] uppercase">The Roadmap</span>
            <h2 className="font-display text-5xl font-bold text-[#1A1A1A]">Path To Success</h2>
            <div className="w-[100px] h-[4px] bg-[#C2541A] mx-auto rounded-full" />
            <p className="mt-6 font-sans text-[#6B7280] text-lg max-w-2xl mx-auto">
              Follow these simple steps to transform your manuscript into a national bestseller on Kenya's premier bookstore.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Setup Account",
                desc: "Provide your email, store details, and M-Pesa info. Complete your merchant profile to start.",
                icon: Store,
                color: "#1B4332"
              },
              {
                title: "Listing Products",
                desc: "Search for existing items to 'Sell This' or use our simple form to add a brand new product catalog.",
                icon: ListPlus,
                color: "#C2541A"
              },
              {
                title: "Order Monitoring",
                desc: "Receive instant notifications via Email and WhatsApp when a reader purchases your book.",
                icon: TrendingUp,
                color: "#1B4332"
              },
              {
                title: "Fulfillment",
                desc: "Deliver orders to our central hub at Bazaar Plaza, Shop A12 within 24 hours of notification.",
                icon: Package,
                color: "#1B4332"
              },
              {
                title: "Quality Review",
                desc: "Our team ensures books are in pristine condition before dispatching to the final customer.",
                icon: ShieldCheck,
                color: "#C2541A"
              },
              {
                title: "Monthly Payouts",
                desc: "Track every sale in real-time. Earnings are sent to your M-Pesa monthly with a detailed sales report.",
                icon: Wallet,
                color: "#1B4332"
              }
            ].map((step, idx) => (
              <div key={idx} className="group p-10 rounded-[2.5rem] bg-white border border-[#E5E0D8] space-y-6 hover:border-[#1B4332]/30 hover:shadow-2xl transition-all relative overflow-hidden">
                <div className="absolute top-4 right-8 font-display text-6xl font-bold text-[#FAF7F2] group-hover:text-[#FAF7F2]/50 transition-colors pointer-events-none">
                  0{idx + 1}
                </div>
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110"
                  style={{ backgroundColor: `${step.color}10`, color: step.color }}
                >
                  <step.icon className="w-8 h-8" />
                </div>
                <div className="space-y-3">
                  <h3 className="font-display text-2xl font-bold text-[#1A1A1A] group-hover:text-[#1B4332] transition-colors">{step.title}</h3>
                  <p className="font-sans text-[#6B7280] leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 📚 Merchant Requirements Grid */}
        <section className="bg-[#FAF7F2] rounded-[4rem] p-12 lg:p-20 border border-[#E5E0D8]">
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-5 space-y-8">
              <h2 className="font-display text-4xl font-bold text-[#1A1A1A]">Vendor Integrity</h2>
              <p className="font-sans text-[#6B7280] text-lg leading-relaxed">
                To maintain the quality of the marketplace, we require all merchants to adhere to our basic core requirements.
              </p>
              <div className="w-[80px] h-[4px] bg-[#C2541A] rounded-full" />
            </div>

            <div className="lg:col-span-7 grid sm:grid-cols-2 gap-4">
              {[
                "Active Kenyan Identity Card",
                "Store Address (Physical or Digital)",
                "Registered M-Pesa Number",
                "Authentic & Genuine Literature",
                "24h Delivery Commitment",
                "Prisinte Product Condition"
              ].map((req, idx) => (
                <div key={idx} className="bg-white p-6 rounded-2xl border border-[#E5E0D8] flex items-center gap-4 hover:border-[#C2541A]/30 transition-all">
                  <CheckCircle2 className="w-6 h-6 text-[#1B4332] shrink-0" />
                  <span className="font-sans font-bold text-[#1A1A1A] text-sm uppercase tracking-wider">{req}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
    </InfoPageLayout>
  );
};

export default VendorGuidePage;
