import { InfoPageLayout } from "@/components/layout/InfoPageLayout";
import { MapPin, Phone, Mail, Clock, MessageCircle, Send, Landmark } from "lucide-react";
import { Button } from "@/components/ui/button";

const ContactPage = () => {
  return (
    <InfoPageLayout 
      label="Contact" 
      title="Get in Touch"
      subtitle="Have questions about a book, an order, or selling on the marketplace? Our team is here to help you every step of the way."
    >
      <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
        {/* Left: Connection Details */}
        <div className="space-y-16">
          <div className="space-y-8">
            <h2 className="font-display text-4xl font-bold text-foreground leading-tight">Visit Our Stores</h2>
            <p className="font-sans text-muted-foreground text-lg leading-relaxed">
              We have two physical locations to serve you better. Stop by to browse our collection or pick up your online orders.
            </p>
          </div>

          <div className="grid gap-12 sm:grid-cols-1">
            {/* Nairobi Branch */}
            <div className="space-y-6 p-8 bg-muted/20 rounded-[2.5rem] border border-border/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center shrink-0">
                  <Landmark className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="font-display text-2xl font-bold">Nairobi Branch</h3>
              </div>
              
              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <MapPin className="w-5 h-5 text-secondary mt-1 shrink-0" />
                  <p className="font-sans text-muted-foreground leading-relaxed">
                    The Bazaar Building, 1st Floor, Shop A12,<br />
                    Moi Avenue, Nairobi, Kenya.
                  </p>
                </div>
                <div className="flex gap-4 items-center">
                  <Clock className="w-5 h-5 text-secondary shrink-0" />
                  <p className="font-sans text-muted-foreground">Mon - Sat: 8:00 AM - 7:00 PM</p>
                </div>
                <div className="h-[250px] rounded-3xl overflow-hidden border border-border">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.819830571169!2d36.81904597582296!3d-1.2819744356499395!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f177852ede453%3A0xd1d8e1b5fae8d01b!2sNuria%3A%20The%20Home%20of%20Independent%20Authors!5e0!3m2!1sen!2ske!4v1776298851000!5m2!1sen!2ske" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen={true} 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Nuria Bookstore Nairobi"
                  />
                </div>
              </div>
            </div>

            {/* Nyali Branch */}
            <div className="space-y-6 p-8 bg-primary/5 rounded-[2.5rem] border border-border/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Landmark className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display text-2xl font-bold">Nyali Branch</h3>
              </div>
              
              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <MapPin className="w-5 h-5 text-primary mt-1 shrink-0" />
                  <p className="font-sans text-muted-foreground leading-relaxed">
                    Links Arcade, 1st Floor,<br />
                    Nyali, Mombasa, Kenya.
                  </p>
                </div>
                <div className="flex gap-4 items-center">
                  <Clock className="w-5 h-5 text-primary shrink-0" />
                  <p className="font-sans text-muted-foreground">Mon - Sat: 9:00 AM - 6:00 PM</p>
                </div>
                <div className="h-[250px] rounded-3xl overflow-hidden border border-border">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3979.9198!2d39.719!3d-4.04!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1840000000000000%3A0x0000000000000000!2sNyali%20Mombasa!5e0!3m2!1sen!2ske!4v1776298851001!5m2!1sen!2ske" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen={true} 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Nuria Bookstore Nyali Mombasa"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Connection & Form Container */}
        <div className="space-y-16">
          <div className="space-y-8 bg-white p-10 lg:p-14 rounded-[3rem] border border-border shadow-2xl shadow-black/5">
            <h2 className="font-display text-3xl font-bold">Contact Support</h2>
            <div className="space-y-8">
              <div className="flex gap-6 items-start group">
                <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center shrink-0 border border-primary/10">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <div className="space-y-1">
                  <p className="font-sans font-bold text-foreground">Support Lines</p>
                  <p className="font-sans text-foreground/90 text-lg break-all">0794 233 261 / 0724 670 194</p>
                </div>
              </div>

              <div className="flex gap-6 items-start group">
                <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center shrink-0 border border-primary/10">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div className="space-y-1">
                  <p className="font-sans font-bold text-foreground">Email Us</p>
                  <p className="font-sans text-foreground/90 text-lg break-all">nuriakenyabookstore@gmail.com</p>
                </div>
              </div>

              <a 
                href="https://wa.me/254794233261" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-3 bg-green-500 text-white py-6 rounded-2xl font-bold uppercase tracking-widest hover:brightness-95 transition-all shadow-xl shadow-green-500/20"
              >
                <MessageCircle className="w-6 h-6 fill-current" />
                Chat on WhatsApp
              </a>
            </div>
          </div>

          {/* Styled Message Form */}
          <div className="bg-white p-10 lg:p-14 rounded-[3rem] border border-border shadow-2xl shadow-black/5">
            <h3 className="font-display text-3xl font-bold text-foreground mb-10">Send a Message</h3>
            <form className="space-y-6" onSubmit={(e) => {
              e.preventDefault();
              import("sonner").then(({ toast }) => {
                toast.success("Thank you for your message! Our team will get back to you shortly.");
                (e.target as HTMLFormElement).reset();
              });
            }}>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="contact-name" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Full Name</label>
                  <input id="contact-name" type="text" placeholder="John Doe" className="w-full px-6 py-4 bg-background border-2 border-transparent rounded-2xl focus:border-primary/10 focus:bg-white transition-all text-sm outline-none" required />
                </div>
                <div className="space-y-2">
                  <label htmlFor="contact-email" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Email Address</label>
                  <input id="contact-email" type="email" placeholder="john@example.com" className="w-full px-6 py-4 bg-background border-2 border-transparent rounded-2xl focus:border-primary/10 focus:bg-white transition-all text-sm outline-none" required />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="contact-message" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Message</label>
                <textarea id="contact-message" rows={5} placeholder="How can we help you today?" className="w-full px-6 py-4 bg-background border-2 border-transparent rounded-2xl focus:border-primary/10 focus:bg-white transition-all text-sm outline-none resize-none"></textarea>
              </div>
              <Button type="submit" className="w-full py-8 bg-primary text-white font-sans font-bold rounded-2xl hover:bg-primary/90 transition-all shadow-xl shadow-primary/10 text-xs tracking-[0.2em] uppercase">
                Send Inquiry <Send className="ml-2 w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </InfoPageLayout>
  );
};

export default ContactPage;
