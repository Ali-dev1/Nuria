import { InfoPageLayout } from "@/components/layout/InfoPageLayout";
import { RotateCcw, ShieldAlert, Package, CheckCircle2, Mail, Phone, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const ReturnsPage = () => {
  return (
    <InfoPageLayout 
      label="Support"
      title="Return Policy"
      subtitle="We want you to love your books. If something isn't right, we've made our return and exchange process simple and transparent."
    >
      <div className="space-y-24">
        {/* Main Policy Intro */}
        <section className="bg-white p-10 lg:p-16 rounded-[3rem] border border-border shadow-2xl shadow-black/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-bl-[100px]" />
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="w-24 h-24 bg-primary rounded-[2rem] flex items-center justify-center shrink-0 shadow-2xl shadow-primary/30">
              <RotateCcw className="w-10 h-10 text-white" />
            </div>
            <div className="flex-1 text-center lg:text-left">
              <span className="font-sans text-[11px] font-bold text-secondary uppercase tracking-[0.3em] mb-4 block">Store Guarantee</span>
              <h2 className="font-display text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-6">30-Day Happiness Period</h2>
              <p className="font-sans text-xl text-muted-foreground leading-relaxed max-w-3xl">
                If for any reason you're not satisfied with your purchase, you have <span className="text-primary font-bold">30 days</span> from the date of delivery to initiate a return or exchange. 
              </p>
            </div>
          </div>
        </section>

        {/* How it Works */}
        <div className="grid lg:grid-cols-2 gap-10">
          <div className="p-12 rounded-[2.5rem] bg-white border border-border space-y-8 shadow-sm hover:border-primary/20 transition-all group">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-2xl bg-primary/5 group-hover:bg-primary group-hover:text-white transition-all">
                <Package className="w-8 h-8 text-primary group-hover:text-white" />
              </div>
              <h3 className="font-display text-3xl font-bold text-foreground">Eligibility</h3>
            </div>
            <div className="space-y-4 font-sans text-lg text-muted-foreground leading-relaxed">
              <p>To qualify for a full return, the book must be in its original condition. Items missing parts or returned over 30 days are ineligible.</p>
              <ul className="space-y-3 pt-4">
                <li className="flex items-center gap-3 text-sm font-bold text-primary">
                  <CheckCircle2 className="w-4 h-4" /> Original packaging preferred
                </li>
                <li className="flex items-center gap-3 text-sm font-bold text-primary">
                  <CheckCircle2 className="w-4 h-4" /> No writing or severe damage
                </li>
              </ul>
            </div>
          </div>

          <div className="p-12 rounded-[2.5rem] bg-white border border-border space-y-8 shadow-sm hover:border-secondary/20 transition-all group">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-2xl bg-secondary/5 group-hover:bg-secondary group-hover:text-white transition-all">
                <ShieldAlert className="w-8 h-8 text-secondary group-hover:text-white" />
              </div>
              <h3 className="font-display text-3xl font-bold text-foreground">Exchanges</h3>
            </div>
            <div className="space-y-4 font-sans text-lg text-muted-foreground leading-relaxed">
              <p>Damaged or defaced books arriving from the publisher are replaced immediately. Please notify us within 24 hours of receiving the book.</p>
              <p className="text-sm italic font-medium bg-background p-4 rounded-xl border-l-4 border-secondary">
                Only regular priced items are refundable; unfortunately sale items cannot be returned.
              </p>
            </div>
          </div>
        </div>

        {/* Shipping & Process */}
        <div className="bg-background rounded-[3rem] p-12 lg:p-20 border border-border relative overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-20">
            <div className="space-y-8">
              <span className="font-sans text-[12px] font-bold text-secondary uppercase tracking-[0.3em]">The Process</span>
              <h3 className="font-display text-4xl font-bold text-foreground leading-tight">Return Shipping <br />& Logistics</h3>
              <p className="font-sans text-muted-foreground text-lg leading-relaxed">
                You will be responsible for domestic shipping costs for returning your item. Shipping costs are non-refundable, except in cases where we sent the wrong title or a damaged book.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <div className="px-6 py-3 bg-primary/5 border border-primary/10 rounded-full font-sans font-bold text-primary text-xs tracking-wider">
                  TRACKED RETURNS ONLY
                </div>
              </div>
            </div>

            <div className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-black/5 space-y-8 border border-border">
              <h4 className="font-display text-2xl font-bold text-foreground">Contact to Initiate</h4>
              <p className="font-sans text-muted-foreground">Please reach out to our team before shipping any items back to our warehouse.</p>
              
              <div className="space-y-6">
                <a href="mailto:nuriakenyabookstore@gmail.com" className="flex items-center gap-6 p-4 rounded-2xl hover:bg-background transition-colors group border border-transparent hover:border-border">
                  <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center group-hover:bg-primary transition-all">
                    <Mail className="w-6 h-6 text-primary group-hover:text-white" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-secondary uppercase tracking-widest">Email Support</p>
                    <p className="font-sans font-bold text-foreground">nuriakenyabookstore@gmail.com</p>
                  </div>
                </a>

                <a href="tel:+254794233261" className="flex items-center gap-6 p-4 rounded-2xl hover:bg-background transition-colors group border border-transparent hover:border-border">
                  <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center group-hover:bg-primary transition-all">
                    <Phone className="w-6 h-6 text-primary group-hover:text-white" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-secondary uppercase tracking-widest">Call Hotlines</p>
                    <p className="font-sans font-bold text-foreground">0794 233261 / 0721 670194</p>
                  </div>
                </a>
              </div>

              <Button className="w-full py-8 bg-secondary hover:bg-secondary/90 text-white rounded-2xl font-sans font-bold text-xs uppercase tracking-widest transition-all">
                START A RETURN <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </InfoPageLayout>
  );
};

export default ReturnsPage;
