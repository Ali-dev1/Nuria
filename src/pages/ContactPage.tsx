import { InfoPageLayout } from "@/components/layout/InfoPageLayout";
import { MapPin, Phone, Mail, Clock, MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

const ContactPage = () => {
  return (
    <InfoPageLayout 
      label="Contact" 
      title="Get in Touch"
      subtitle="Have questions about a book, an order, or selling on the marketplace? Our team is here to help you every step of the way."
    >
      <div className="grid lg:grid-cols-2 gap-16 items-start">
        {/* 📍 Left: Connection Details */}
        <div className="space-y-12">
          <div className="space-y-6">
            <h2 className="font-display text-4xl font-bold text-[#1A1A1A]">Visit Our Store</h2>
            <p className="font-sans text-[#6B7280] text-lg leading-relaxed">
              We are located in the heart of Nairobi. Stop by to browse our physical collection or pick up your online orders.
            </p>
          </div>

          <div className="space-y-8">
            <div className="flex gap-6 items-start group">
              <div className="w-14 h-14 rounded-2xl bg-[#A1440B]/5 flex items-center justify-center shrink-0 border border-[#A1440B]/10 group-hover:bg-[#A1440B]/10 transition-colors">
                <MapPin className="w-6 h-6 text-[#A1440B]" />
              </div>
              <div className="space-y-2">
                <p className="font-sans font-bold text-[#1A1A1A] text-lg">Our Location</p>
                <p className="font-sans text-[#6B7280] leading-relaxed">
                  The Bazaar Building, 1st Floor, Shop A12,<br />
                  Moi Avenue, Nairobi, Kenya.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start group">
              <div className="w-14 h-14 rounded-2xl bg-[#1B4332]/5 flex items-center justify-center shrink-0 border border-[#1B4332]/10 group-hover:bg-[#1B4332]/10 transition-colors">
                <Phone className="w-6 h-6 text-[#1B4332]" />
              </div>
              <div className="space-y-2">
                <p className="font-sans font-bold text-[#1A1A1A] text-lg">Support Lines</p>
                <p className="font-sans text-[#6B7280] text-lg">0794 233261 / 0724 670194</p>
              </div>
            </div>

            <div className="flex gap-6 items-start group">
              <div className="w-14 h-14 rounded-2xl bg-[#1B4332]/5 flex items-center justify-center shrink-0 border border-[#1B4332]/10 group-hover:bg-[#1B4332]/10 transition-colors">
                <Mail className="w-6 h-6 text-[#1B4332]" />
              </div>
              <div className="space-y-2">
                <p className="font-sans font-bold text-[#1A1A1A] text-lg">Email Us</p>
                <p className="font-sans text-[#6B7280]">nuriakenyabookstore@gmail.com</p>
              </div>
            </div>

            <div className="flex gap-6 items-start group">
              <div className="w-14 h-14 rounded-2xl bg-[#1B4332]/5 flex items-center justify-center shrink-0 border border-[#1B4332]/10 group-hover:bg-[#1B4332]/10 transition-colors">
                <Clock className="w-6 h-6 text-[#1B4332]" />
              </div>
              <div className="space-y-2">
                <p className="font-sans font-bold text-[#1A1A1A] text-lg">Open Hours</p>
                <p className="font-sans text-[#6B7280] leading-relaxed">
                  Mon - Sat: 8:00 AM - 7:00 PM<br />
                  <span className="text-red-500/80 font-medium">Closed on Sundays & Holidays</span>
                </p>
              </div>
            </div>
          </div>

          <a 
            href="https://wa.me/254794233261" 
            target="_blank" 
            rel="noreferrer"
            className="inline-flex w-full items-center justify-center gap-3 bg-[#25D366] text-white py-5 rounded-2xl font-bold uppercase tracking-widest hover:brightness-95 transition-all shadow-xl shadow-[#25D366]/20"
          >
            <MessageCircle className="w-6 h-6 fill-current" />
            Chat via WhatsApp
          </a>
        </div>

        {/* ✉️ Right: Map & Form Container */}
        <div className="space-y-12">
          {/* Integrated Map */}
          <div className="h-[300px] bg-white rounded-[2.5rem] overflow-hidden border border-[#E5E0D8] relative shadow-2xl shadow-black/5 group">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.819830571169!2d36.81904597582296!3d-1.2819744356499395!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f177852ede453%3A0xd1d8e1b5fae8d01b!2sNuria%3A%20The%20Home%20of%20Independent%20Authors!5e0!3m2!1sen!2ske!4v1776298851000!5m2!1sen!2ske" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Nuria Bookstore Location — Bazaar Plaza, Nairobi"
              className="grayscale group-hover:grayscale-0 transition-all duration-700"
            />
          </div>

          {/* Styled Message Form */}
          <div className="bg-white p-10 lg:p-14 rounded-[3rem] border border-[#E5E0D8] shadow-2xl shadow-black/5">
            <h3 className="font-display text-3xl font-bold text-[#1A1A1A] mb-10">Send a Message</h3>
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="contact-name" className="text-[10px] font-bold uppercase tracking-widest text-[#6B7280] ml-1">Full Name</label>
                  <input 
                    id="contact-name"
                    type="text" 
                    placeholder="John Doe"
                    className="w-full px-6 py-4 bg-[#FAF7F2] border-2 border-transparent rounded-2xl focus:border-[#1B4332]/10 focus:bg-white transition-all text-sm outline-none" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="contact-email" className="text-[10px] font-bold uppercase tracking-widest text-[#6B7280] ml-1">Email Address</label>
                  <input 
                    id="contact-email"
                    type="email" 
                    placeholder="john@example.com"
                    className="w-full px-6 py-4 bg-[#FAF7F2] border-2 border-transparent rounded-2xl focus:border-[#1B4332]/10 focus:bg-white transition-all text-sm outline-none" 
                    required 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="contact-subject" className="text-[10px] font-bold uppercase tracking-widest text-[#6B7280] ml-1">Subject</label>
                <input 
                  id="contact-subject"
                  type="text" 
                  placeholder="Inquiry about..."
                  className="w-full px-6 py-4 bg-[#FAF7F2] border-2 border-transparent rounded-2xl focus:border-[#1B4332]/10 focus:bg-white transition-all text-sm outline-none" 
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="contact-message" className="text-[10px] font-bold uppercase tracking-widest text-[#6B7280] ml-1">Message</label>
                <textarea 
                  id="contact-message"
                  rows={5} 
                  placeholder="How can we help you today?"
                  className="w-full px-6 py-4 bg-[#FAF7F2] border-2 border-transparent rounded-2xl focus:border-[#1B4332]/10 focus:bg-white transition-all text-sm outline-none resize-none"
                ></textarea>
              </div>
              <Button className="w-full py-8 bg-[#1B4332] text-white font-sans font-bold rounded-2xl hover:bg-[#132c21] transition-all shadow-xl shadow-[#1B4332]/10 text-xs tracking-[0.2em] uppercase">
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
