import { InfoPageLayout } from "@/components/layout/InfoPageLayout";
import { Lock, Eye, FileText, Globe, Mail } from "lucide-react";

const PrivacyPage = () => {
  return (
    <InfoPageLayout 
      label="Legal"
      title="Privacy Policy"
      subtitle="Your privacy is critically important to us. Learn how we collect, use, and protect your personal information at Nuria Store."
    >
      <div className="space-y-20">
        {/* Status Header */}
        <section className="bg-primary p-10 lg:p-14 rounded-[3rem] text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-bl-[200px]" />
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="space-y-4 text-center md:text-left">
              <span className="font-sans text-[11px] font-bold text-secondary uppercase tracking-[0.3em] mb-4 block">Policy Status</span>
              <h2 className="font-display text-4xl font-bold">Privacy Matters</h2>
              <p className="font-sans text-white/70 max-w-md">Our commitment to transparency and data protection for every reader.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl text-center">
              <p className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-1">Effective As Of</p>
              <p className="font-display text-2xl font-bold text-white">1st August, 2020</p>
            </div>
          </div>
        </section>

        {/* Core Sections */}
        <div className="grid lg:grid-cols-2 gap-10">
          <div className="bg-white p-10 lg:p-12 rounded-[3rem] border border-border space-y-8 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display text-2xl font-bold text-foreground">Information Collection</h3>
            </div>
            <p className="font-sans text-muted-foreground leading-relaxed text-lg">
              While using our Site, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you. This includes your name, email address, mailing address and phone number for delivery purposes.
            </p>
          </div>

          <div className="bg-white p-10 lg:p-12 rounded-[3rem] border border-border space-y-8 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center">
                <Eye className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display text-2xl font-bold text-foreground">Log Data</h3>
            </div>
            <p className="font-sans text-muted-foreground leading-relaxed text-lg">
              Like many site operators, we collect information that your browser sends whenever you visit our Site ("Log Data"). This includes your IP address, browser type, pages visited, and the time spent on those pages to improve our user experience.
            </p>
          </div>
        </div>

        {/* Communications & Cookies */}
        <section className="bg-background p-12 lg:p-20 rounded-[4rem] border border-border">
          <div className="grid lg:grid-cols-2 gap-20">
            <div className="space-y-6">
              <h3 className="font-display text-3xl font-bold text-foreground">Communications</h3>
              <p className="font-sans text-muted-foreground text-lg leading-relaxed">
                We may use your Personal Information to contact you with newsletters, marketing or promotional materials that may be of interest to you. You may opt out of receiving any of these communications at any time.
              </p>
              <div className="p-6 bg-white border border-border rounded-2xl flex items-center gap-4">
                <Lock className="w-6 h-6 text-secondary" />
                <p className="text-sm font-bold text-foreground">Secure SSL Encryption for all Payouts</p>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="font-display text-3xl font-bold text-foreground">Cookies & Security</h3>
              <p className="font-sans text-muted-foreground text-lg leading-relaxed">
                Cookies are files with small amount of data, which may include an anonymous unique identifier. We use these to remember your cart and preferences. While we strive to use commercially acceptable means to protect your data, no method is 100% secure.
              </p>
              <div className="flex gap-4">
                <span className="px-5 py-2 bg-primary text-white rounded-full text-[10px] font-bold uppercase tracking-widest">GDPR COMPLIANT</span>
                <span className="px-5 py-2 border border-border text-foreground rounded-full text-[10px] font-bold uppercase tracking-widest bg-white">SECURE STORAGE</span>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="text-center max-w-2xl mx-auto space-y-8">
          <div className="w-20 h-20 rounded-full bg-background border border-border flex items-center justify-center mx-auto mb-8">
            <Globe className="w-8 h-8 text-secondary" />
          </div>
          <h3 className="font-display text-3xl font-bold text-foreground">Questions about privacy?</h3>
          <p className="font-sans text-muted-foreground text-lg leading-relaxed">
            If you have any questions about this Privacy Policy, please contact us. We are committed to responding to all data inquiries within 48 hours.
          </p>
          <div className="pt-6">
            <a 
              href="mailto:nuriakenyabookstore@gmail.com" 
              className="inline-flex items-center gap-3 font-sans font-bold text-primary hover:text-secondary transition-colors border-b-2 border-primary/10 pb-1"
            >
              <Mail className="w-5 h-5" /> nuriakenyabookstore@gmail.com
            </a>
          </div>
        </section>
      </div>
    </InfoPageLayout>
  );
};

export default PrivacyPage;
