import { InfoPageLayout } from "@/components/layout/InfoPageLayout";
import { Truck, Globe, Clock, ShieldCheck, MapPin, PackageCheck } from "lucide-react";

const DeliveryPage = () => {
  return (
    <InfoPageLayout 
      label="Delivery Policy" 
      title="Shipping & Delivery"
      subtitle="Fast, reliable, and trackable. We deliver your next great read right to your doorstep, across Kenya and worldwide."
    >
      <div className="space-y-20">
        {/* Feature Highlights */}
        <div className="grid md:grid-cols-2 gap-10">
          <div className="bg-primary p-10 lg:p-14 rounded-[3rem] text-white relative overflow-hidden group shadow-2xl shadow-black/5">
            <div className="absolute inset-0 opacity-10 bg-[url('/grid-pattern.svg')] bg-repeat" />
            <div className="relative z-10 space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-display text-3xl font-bold">Same Day Delivery</h3>
              <p className="font-sans text-white/80 leading-relaxed text-lg italic">
                Orders placed within Nairobi before 3:00 PM are delivered the same day. Perfect for when you can't wait to start your next chapter.
              </p>
            </div>
          </div>
          
          <div className="bg-white p-10 lg:p-14 rounded-[3rem] border border-border relative overflow-hidden group shadow-2xl shadow-black/5">
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-bl-full" />
            <div className="relative z-10 space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-secondary/5 flex items-center justify-center border border-secondary/10">
                <Truck className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="font-display text-3xl font-bold text-foreground">National Coverage</h3>
              <p className="font-sans text-muted-foreground leading-relaxed text-lg">
                We reach all 47 counties of Kenya. Upcountry orders are delivered within 24-48 hours via our trusted courier partners.
              </p>
            </div>
          </div>
        </div>

        {/* Shipping Tiers */}
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            { 
              title: "Nairobi CBD", 
              desc: "Same Day (before 3pm)", 
              icon: MapPin, 
              tag: "FLAT RATE" 
            },
            { 
              title: "Upcountry", 
              desc: "Next Day Delivery", 
              icon: PackageCheck, 
              tag: "TRACKED" 
            },
            { 
              title: "International", 
              desc: "DHL Express (1-3 days)", 
              icon: Globe, 
              tag: "GLOBAL" 
            }
          ].map((tier, i) => (
            <div key={tier.title} className="bg-white p-8 rounded-3xl border border-border hover:border-secondary/30 transition-all group text-center">
              <div className="w-12 h-12 rounded-2xl bg-background flex items-center justify-center mx-auto mb-6 group-hover:bg-primary group-hover:text-white transition-all">
                <tier.icon className="w-6 h-6" />
              </div>
              <h4 className="font-display text-xl font-bold text-foreground">{tier.title}</h4>
              <p className="font-sans text-muted-foreground text-sm mt-2">{tier.desc}</p>
              <span className="inline-block mt-4 text-[9px] font-bold text-secondary tracking-[0.2em] border border-secondary/20 px-3 py-1 rounded-full">{tier.tag}</span>
            </div>
          ))}
        </div>

        {/* Rates Table Section */}
        <div className="space-y-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-md text-center lg:text-left">
              <h2 className="font-display text-4xl font-bold text-foreground">Standard Rates</h2>
              <div className="w-[80px] h-[4px] bg-secondary mt-6 rounded-full mx-auto lg:mx-0" />
            </div>
            
            <div className="bg-green-100 border border-primary/10 px-8 py-6 rounded-3xl flex items-center gap-4 shadow-xl shadow-primary/5">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white shrink-0">
                <span className="font-bold text-lg"></span>
              </div>
              <div>
                <p className="font-sans font-bold text-primary">Free Delivery Offer</p>
                <p className="font-sans text-sm text-primary/80">Enjoy free delivery within Nairobi for orders above <span className="font-bold underline">KSh 10,000</span></p>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-[2.5rem] border border-border shadow-2xl shadow-black/5 bg-white">
            <table className="w-full text-left font-sans">
              <thead className="bg-background text-foreground text-xs font-bold uppercase tracking-widest border-b border-border">
                <tr>
                  <th className="px-10 py-8">Destination Area</th>
                  <th className="px-10 py-8 text-right">Standard Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr className="group hover:bg-background/50 transition-colors">
                  <td className="px-10 py-8 text-foreground font-bold">Nairobi CBD & Surroundings</td>
                  <td className="px-10 py-8 text-right font-display text-xl font-bold text-primary">KSh 250</td>
                </tr>
                <tr className="group hover:bg-background/50 transition-colors">
                  <td className="px-10 py-8 text-foreground font-bold">Nairobi Outskirts (Thika, Ngong, Kitengela)</td>
                  <td className="px-10 py-8 text-right font-display text-xl font-bold text-primary">KSh 350</td>
                </tr>
                <tr className="group hover:bg-background/50 transition-colors">
                  <td className="px-10 py-8 text-foreground font-bold">Upcountry Major Towns</td>
                  <td className="px-10 py-8 text-right font-display text-xl font-bold text-primary">KSh 450</td>
                </tr>
                <tr className="group hover:bg-background/50 transition-colors">
                  <td className="px-10 py-8 text-foreground font-bold">International (Worldwide)</td>
                  <td className="px-10 py-8 text-right font-sans text-xs font-bold text-secondary tracking-wider italic uppercase">Calculated at Checkout via DHL</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Guarantee Box */}
        <div className="bg-primary rounded-[3rem] p-12 lg:p-20 text-white relative overflow-hidden text-center shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -mr-40 -mt-40 blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-8">
            <ShieldCheck className="w-16 h-16 text-secondary mx-auto animate-pulse-subtle" />
            <h3 className="font-display text-3xl lg:text-4xl font-bold leading-tight">Peace of mind, <br />from our shelf to your door.</h3>
            <p className="font-sans text-xl text-white/70 leading-relaxed">
              Every package is handled with care and comes with full tracking details sent directly to your phone. If you're not home, we'll coordinate a safe delivery time with you.
            </p>
          </div>
        </div>
      </div>
    </InfoPageLayout>
  );
};

export default DeliveryPage;
