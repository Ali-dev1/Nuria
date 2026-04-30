import { InfoPageLayout } from "@/components/layout/InfoPageLayout";
import { RotateCcw, ShieldAlert, Package, CheckCircle2, Mail, Phone, ArrowRight, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const ReturnsPage = () => {
  return (
    <InfoPageLayout 
      label="Support"
      title="Return Policy"
      subtitle="We want you to love your books. If something isn't right, we've made our return and exchange process simple and transparent."
    >
      <div className="space-y-32">
        {/* Modern Intro Section */}
        <section className="relative">
          <div className="grid lg:grid-cols-5 gap-12 items-center">
            <div className="lg:col-span-3 space-y-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-[10px] font-bold text-primary uppercase tracking-[0.2em]">
                <RotateCcw className="w-3.5 h-3.5" /> Trusted Marketplace
              </div>
              <h2 className="font-display text-5xl lg:text-7xl font-bold text-foreground leading-[1.1]">
                30-Day Happiness <br />
                <span className="text-primary italic">Period.</span>
              </h2>
              <p className="font-sans text-xl text-muted-foreground leading-relaxed">
                If for any reason you're not satisfied with your purchase, you have <span className="text-primary font-bold">30 days</span> from the date of delivery to initiate a return or exchange.
              </p>
              <div className="flex gap-4">
                <Button 
                  onClick={() => {
                    import("sonner").then(({ toast }) => {
                      toast.info("To initiate a return, please email our support team with your order number and reason for return.");
                    });
                  }}
                  className="rounded-2xl px-8 py-6 bg-primary text-white font-bold text-xs uppercase tracking-widest shadow-xl shadow-primary/20"
                >
                  Initiate Return
                </Button>
                <div className="flex items-center gap-3 px-6 text-muted-foreground">
                  <HelpCircle className="w-5 h-5 opacity-50" />
                  <span className="text-xs font-bold uppercase tracking-widest">Policy FAQ</span>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-2">
              <div className="bg-muted/30 rounded-[3rem] p-10 lg:p-14 border border-border space-y-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16" />
                <ShieldAlert className="w-12 h-12 text-secondary" />
                <h4 className="font-display text-2xl font-bold">Quick Facts</h4>
                <ul className="space-y-4">
                  {[
                    "Original condition only",
                    "30 day return window",
                    "No restocking fees",
                    "Tracked returns only"
                  ].map((fact) => (
                    <li key={fact} className="flex items-center gap-3 text-sm font-bold text-foreground/70">
                      <CheckCircle2 className="w-4 h-4 text-green-500" /> {fact}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Eligibility & Exchanges - Horizontal Cards */}
        <section className="grid lg:grid-cols-2 gap-12">
          <div className="group bg-white p-12 rounded-[3.5rem] border border-border hover:border-primary/20 transition-all shadow-2xl shadow-black/5">
            <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center mb-10 group-hover:bg-primary group-hover:text-white transition-all">
              <Package className="w-8 h-8" />
            </div>
            <h3 className="font-display text-4xl font-bold text-foreground mb-6">Eligibility</h3>
            <p className="font-sans text-lg text-muted-foreground leading-relaxed mb-8">
              To qualify for a full return, the book must be in its original condition. Items missing parts or returned over 30 days are ineligible.
            </p>
            <div className="space-y-4 border-t border-border pt-8">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Requirements</p>
              <div className="flex flex-wrap gap-3">
                <span className="px-4 py-2 bg-background rounded-xl border border-border text-[10px] font-bold uppercase tracking-wider">Original Packaging</span>
                <span className="px-4 py-2 bg-background rounded-xl border border-border text-[10px] font-bold uppercase tracking-wider">No Writing</span>
              </div>
            </div>
          </div>

          <div className="group bg-white p-12 rounded-[3.5rem] border border-border hover:border-secondary/20 transition-all shadow-2xl shadow-black/5">
            <div className="w-16 h-16 rounded-2xl bg-secondary/5 flex items-center justify-center mb-10 group-hover:bg-secondary group-hover:text-white transition-all">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h3 className="font-display text-4xl font-bold text-foreground mb-6">Exchanges</h3>
            <p className="font-sans text-lg text-muted-foreground leading-relaxed mb-8">
              Damaged or defaced books arriving from the publisher are replaced immediately. Please notify us within 24 hours of receipt.
            </p>
            <div className="p-6 bg-secondary/5 rounded-2xl border-l-4 border-secondary">
              <p className="font-sans text-sm italic text-secondary-foreground font-medium">
                Note: Only regular priced items are refundable; unfortunately sale items cannot be returned.
              </p>
            </div>
          </div>
        </section>

        {/* Process Steps */}
        <section className="bg-primary rounded-[4rem] p-12 lg:p-24 text-white relative overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-20 items-center relative z-10">
            <div className="space-y-8">
              <span className="font-sans text-[11px] font-bold text-secondary uppercase tracking-[0.3em]">Logistics</span>
              <h3 className="font-display text-4xl lg:text-5xl font-bold leading-tight">Return Shipping <br />& Support</h3>
              <p className="font-sans text-xl text-white/90 leading-relaxed">
                You will be responsible for shipping costs for returning your item. Shipping costs are non-refundable, except in cases where we sent the wrong title.
              </p>
              <div className="flex items-center gap-4 pt-4">
                <div className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center font-display font-bold">?</div>
                <p className="font-sans text-sm text-white/80">Questions? Contact our 24/7 support line.</p>
              </div>
            </div>

            <div className="bg-white rounded-[3rem] p-10 lg:p-14 text-foreground space-y-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-border">
              <div className="space-y-6">
                <a href="mailto:nuriakenyabookstore@gmail.com" className="flex items-center gap-6 group">
                  <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center group-hover:bg-primary transition-all">
                    <Mail className="w-6 h-6 text-primary group-hover:text-white" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Email Channel</p>
                    <p className="font-sans font-bold text-lg break-all">nuriakenyabookstore@gmail.com</p>
                  </div>
                </a>

                <a href="tel:+254794233261" className="flex items-center gap-6 group">
                  <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center group-hover:bg-primary transition-all">
                    <Phone className="w-6 h-6 text-primary group-hover:text-white" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Direct Hotline</p>
                    <p className="font-sans font-bold text-lg break-all">0794 233 261 / 0721 670 194</p>
                  </div>
                </a>
              </div>

              <Button 
                onClick={() => {
                  import("sonner").then(({ toast }) => {
                    toast.info("Please reach out via the email or phone number above to start your return process.");
                  });
                }}
                className="w-full py-8 bg-secondary text-white rounded-2xl font-bold uppercase tracking-widest hover:brightness-95 transition-all text-[10px] shadow-lg shadow-secondary/10"
              >
                START A RETURN PROCESS <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        </section>
      </div>
    </InfoPageLayout>
  );
};

export default ReturnsPage;
