import { InfoPageLayout } from "@/components/layout/InfoPageLayout";
import { Store, ListPlus, Wallet, CheckCircle2, BadgePercent, Package, TrendingUp, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const VendorGuidePage = () => {
  return (
    <InfoPageLayout 
      label="Merchant Center" 
      title="Selling on Nuria"
      subtitle="Join Kenya's most forward-thinking digital marketplace for literature. We empower authors and publishers to reach their readers directly."
    >
      <div className="space-y-24">
        {/* Partnership Value Prop */}
        <section className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-foreground leading-tight">
              A partnership built <br />on <span className="text-secondary">transparency.</span>
            </h2>
            <p className="font-sans text-xl text-muted-foreground leading-relaxed">
              At Nuria, we believe creators deserve a fair share. We only earn when you sell — meaning zero listing fees and radical honesty in every payout.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 bg-white border border-border rounded-3xl space-y-3">
                <TrendingUp className="w-8 h-8 text-primary" />
                <h4 className="font-bold text-foreground">No Monthly Fees</h4>
                <p className="text-sm text-muted-foreground">Pay only when you make a sale.</p>
              </div>
              <div className="p-6 bg-white border border-border rounded-3xl space-y-3">
                <ShieldCheck className="w-8 h-8 text-primary" />
                <h4 className="font-bold text-foreground">Author First</h4>
                <p className="text-sm text-muted-foreground">Dedicated support for local creators.</p>
              </div>
            </div>
          </div>

          <div className="bg-primary p-10 lg:p-16 rounded-[4rem] text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
            <div className="relative z-10 space-y-8 text-center lg:text-left">
              <div className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-3xl flex items-center justify-center border border-white/20 mx-auto lg:mx-0">
                <BadgePercent className="w-10 h-10 text-secondary" />
              </div>
              <div className="space-y-2">
                <h3 className="font-display text-3xl font-bold">Simple Commission</h3>
                <p className="font-sans text-white/70 leading-relaxed text-lg italic">
                  "Our commission structure is category-based and transparent. We process vendor payouts monthly via M-Pesa like clockwork."
                </p>
              </div>
              <Button 
                onClick={() => window.location.href = "/vendor/register"}
                className="w-full py-8 bg-secondary hover:bg-secondary/90 rounded-2xl font-bold uppercase tracking-widest text-xs border-none shadow-xl shadow-black/20"
              >
                Register as Vendor
              </Button>
            </div>
          </div>
        </section>

        {/* 6-Step Roadmap */}
        <section className="space-y-16">
          <div className="text-center space-y-4">
            <span className="font-sans text-[12px] font-bold text-secondary tracking-[0.3em] uppercase">The Roadmap</span>
            <h2 className="font-display text-5xl font-bold text-foreground">Path To Success</h2>
            <div className="w-[100px] h-[4px] bg-secondary mx-auto rounded-full" />
            <p className="mt-6 font-sans text-muted-foreground text-lg max-w-2xl mx-auto">
              Follow these simple steps to transform your manuscript into a national bestseller on Kenya's premier bookstore.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Setup Account",
                desc: "Provide your email, store details, and M-Pesa info. Complete your merchant profile to start.",
                icon: Store,
                variant: "primary" as const
              },
              {
                title: "Listing Products",
                desc: "Search for existing items to 'Sell This' or use our simple form to add a brand new product catalog.",
                icon: ListPlus,
                variant: "accent" as const
              },
              {
                title: "Order Monitoring",
                desc: "Receive instant notifications via Email and WhatsApp when a reader purchases your book.",
                icon: TrendingUp,
                variant: "primary" as const
              },
              {
                title: "Fulfillment",
                desc: "Deliver orders to our central hub at Bazaar Plaza, Shop A12 within 24 hours of notification.",
                icon: Package,
                variant: "primary" as const
              },
              {
                title: "Quality Review",
                desc: "Our team ensures books are in pristine condition before dispatching to the final customer.",
                icon: ShieldCheck,
                variant: "accent" as const
              },
              {
                title: "Monthly Payouts",
                desc: "Track every sale in real-time. Earnings are sent to your M-Pesa monthly with a detailed sales report.",
                icon: Wallet,
                variant: "primary" as const
              }
            ].map((step, idx) => (
              <div key={step.title} className="group p-10 rounded-[2.5rem] bg-white border border-border space-y-6 hover:border-primary/30 hover:shadow-2xl transition-all relative overflow-hidden">
                <div className="absolute top-4 right-8 font-display text-6xl font-bold text-primary-foreground group-hover:text-primary-foreground/50 transition-colors pointer-events-none">
                  0{idx + 1}
                </div>
                <div 
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 ${step.variant === "accent" ? "bg-secondary/10 text-secondary" : "bg-primary/10 text-primary"}`}
                >
                  <step.icon className="w-8 h-8" />
                </div>
                <div className="space-y-3">
                  <h3 className="font-display text-2xl font-bold text-foreground group-hover:text-primary transition-colors">{step.title}</h3>
                  <p className="font-sans text-muted-foreground leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Merchant Requirements Grid */}
        <section className="bg-background rounded-[4rem] p-12 lg:p-20 border border-border">
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-5 space-y-8">
              <h2 className="font-display text-4xl font-bold text-foreground">Vendor Integrity</h2>
              <p className="font-sans text-muted-foreground text-lg leading-relaxed">
                To maintain the quality of the marketplace, we require all merchants to adhere to our basic core requirements.
              </p>
              <div className="w-[80px] h-[4px] bg-secondary rounded-full" />
            </div>

            <div className="lg:col-span-7 grid sm:grid-cols-2 gap-4">
              {[
                "Active Kenyan Identity Card",
                "Store Address (Physical or Digital)",
                "Registered M-Pesa Number",
                "Authentic & Genuine Literature",
                "24h Delivery Commitment",
                "Prisinte Product Condition"
              ].map((req) => (
                <div key={req} className="bg-white p-6 rounded-2xl border border-border flex items-center gap-4 hover:border-secondary/30 transition-all">
                  <CheckCircle2 className="w-6 h-6 text-primary shrink-0" />
                  <span className="font-sans font-bold text-foreground text-sm uppercase tracking-wider">{req}</span>
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
