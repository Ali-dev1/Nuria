import { InfoPageLayout } from "@/components/layout/InfoPageLayout";
import { Truck, Globe, Clock, ShieldCheck, MapPin, PackageCheck, Zap, Info } from "lucide-react";

const DeliveryPage = () => {
  return (
    <InfoPageLayout 
      label="Delivery Policy" 
      title="Shipping & Delivery"
      subtitle="Fast, reliable, and trackable. We deliver your next great read right to your doorstep, across Kenya and worldwide."
    >
      <div className="space-y-32">
        {/* Expanded Feature Highlights */}
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="bg-primary rounded-[3.5rem] p-12 lg:p-16 text-white relative overflow-hidden group shadow-2xl">
            <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none" />
            <div className="relative z-10 space-y-10">
              <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md">
                <Zap className="w-8 h-8 text-secondary" />
              </div>
              <div className="space-y-4">
                <h3 className="font-display text-4xl font-bold">Same Day Delivery</h3>
                <p className="font-sans text-white/70 leading-relaxed text-lg">
                  Orders placed within Nairobi before 3:00 PM are delivered the same day. Perfect for when you can't wait to start your next chapter.
                </p>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 text-[10px] font-bold uppercase tracking-widest">
                <Clock className="w-4 h-4 text-secondary" /> Nairobi Exclusive
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-[3.5rem] p-12 lg:p-16 border border-border relative overflow-hidden group shadow-2xl shadow-black/5">
            <div className="relative z-10 space-y-10">
              <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center border border-primary/10">
                <Truck className="w-8 h-8 text-primary" />
              </div>
              <div className="space-y-4">
                <h3 className="font-display text-4xl font-bold text-foreground">National Coverage</h3>
                <p className="font-sans text-muted-foreground leading-relaxed text-lg">
                  We reach all 47 counties of Kenya. Upcountry orders are delivered within 24-48 hours via our trusted courier partners.
                </p>
              </div>
              <div className="flex gap-4">
                <div className="px-4 py-2 bg-background rounded-full border border-border text-[10px] font-bold uppercase tracking-widest text-muted-foreground">47 Counties</div>
                <div className="px-4 py-2 bg-background rounded-full border border-border text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Tracked</div>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping Tiers - Modern Grid */}
        <div className="grid sm:grid-cols-3 gap-8">
          {[
            { 
              title: "Nairobi CBD", 
              desc: "Same Day (before 3pm)", 
              icon: MapPin, 
              tag: "FLAT RATE",
              color: "bg-secondary/10 text-secondary"
            },
            { 
              title: "Upcountry", 
              desc: "Next Day Delivery", 
              icon: PackageCheck, 
              tag: "TRACKED",
              color: "bg-primary/10 text-primary"
            },
            { 
              title: "International", 
              desc: "DHL Express (1-3 days)", 
              icon: Globe, 
              tag: "GLOBAL",
              color: "bg-blue-500/10 text-blue-500"
            }
          ].map((tier) => (
            <div key={tier.title} className="bg-white p-10 rounded-[2.5rem] border border-border hover:border-primary/20 transition-all group flex flex-col items-center text-center">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 transition-transform group-hover:scale-110 ${tier.color}`}>
                <tier.icon className="w-7 h-7" />
              </div>
              <h4 className="font-display text-2xl font-bold text-foreground mb-3">{tier.title}</h4>
              <p className="font-sans text-muted-foreground text-sm leading-relaxed mb-6">{tier.desc}</p>
              <span className="mt-auto text-[10px] font-bold tracking-[0.2em] border border-border px-4 py-1.5 rounded-full group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all uppercase">
                {tier.tag}
              </span>
            </div>
          ))}
        </div>

        {/* Pricing Section */}
        <div className="space-y-12">
          <div className="flex flex-col lg:flex-row items-end justify-between gap-8 border-b border-border pb-12">
            <div className="space-y-4 max-w-xl">
              <h2 className="font-display text-4xl lg:text-5xl font-bold text-foreground">Standard Delivery Rates</h2>
              <p className="font-sans text-muted-foreground text-lg">Clear and upfront pricing for all your orders. No hidden fees.</p>
            </div>
            
            <div className="bg-green-500/5 border border-green-500/20 px-8 py-6 rounded-[2rem] flex items-center gap-6">
              <div className="w-14 h-14 rounded-2xl bg-green-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-green-500/20">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div>
                <p className="font-sans font-black text-green-600 uppercase tracking-widest text-[10px]">Special Offer</p>
                <p className="font-sans text-sm text-foreground/80 mt-1">Free delivery within Nairobi for orders above <span className="font-bold text-green-600">KSh 10,000</span></p>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 overflow-hidden rounded-[3rem] border border-border bg-white shadow-2xl shadow-black/5">
              <table className="w-full text-left font-sans">
                <tbody className="divide-y divide-border">
                  {[
                    { zone: "Nairobi CBD & Surroundings", rate: "KSh 250", time: "Same Day" },
                    { zone: "Nairobi Outskirts (Thika, Ngong, etc)", rate: "KSh 350", time: "24 Hours" },
                    { zone: "Upcountry Major Towns", rate: "KSh 450", time: "24-48 Hours" },
                    { zone: "International (Worldwide)", rate: "DHL Rates", time: "1-3 Days" }
                  ].map((item) => (
                    <tr key={item.zone} className="group hover:bg-muted/30 transition-colors">
                      <td className="px-10 py-10">
                        <p className="text-foreground font-bold text-lg">{item.zone}</p>
                        <p className="text-muted-foreground text-xs uppercase tracking-widest mt-1 font-bold">{item.time}</p>
                      </td>
                      <td className="px-10 py-10 text-right">
                        <span className="font-display text-2xl font-bold text-primary">{item.rate}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-primary rounded-[3rem] p-10 text-white flex flex-col justify-center space-y-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16" />
              <Info className="w-10 h-10 text-secondary" />
              <h4 className="font-display text-2xl font-bold">Important Note</h4>
              <p className="font-sans text-white/70 leading-relaxed">
                Please ensure your delivery address and phone number are correct. Our riders will contact you before arriving at your location.
              </p>
              <div className="pt-4">
                <button 
                  onClick={() => {
                    import("sonner").then(({ toast }) => {
                      toast.info("Tracking details are sent to your phone via SMS once your order is dispatched. You can also view status in your Account dashboard.");
                    });
                  }}
                  className="text-secondary font-bold text-sm uppercase tracking-widest border-b-2 border-secondary/20 hover:border-secondary transition-all"
                >
                  Track Your Order
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </InfoPageLayout>
  );
};

export default DeliveryPage;
