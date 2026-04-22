import { InfoPageLayout } from "@/components/layout/InfoPageLayout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle, Truck, ShoppingBag, CreditCard, ShieldCheck, User } from "lucide-react";

const faqData = [
  {
    category: "General Information",
    icon: HelpCircle,
    questions: [
      {
        q: "What is Nuria's 'The Honest Store' policy?",
        a: "Our policy is built on radical transparency. We ensure all books are ethically sourced, authors are paid fairly and promptly via M-Pesa, and customers get exactly what they order with no hidden fees."
      },
      {
        q: "Where is your physical store located?",
        a: "We are located at The Bazaar Building, 1st Floor, Shop A12, along Moi Avenue in Nairobi CBD."
      }
    ]
  },
  {
    category: "Orders & Payments",
    icon: ShoppingBag,
    questions: [
      {
        q: "What payment methods do you accept?",
        a: "We accept M-Pesa (Till Number), Visa, PesaPal, and even Bitcoin for digital-savvy readers."
      },
      {
        q: "Can I cancel my order?",
        a: "Yes, you can cancel your order within 2 hours of placement. After it has been dispatched, we follow our standard return policy."
      }
    ]
  },
  {
    category: "Shipping & Delivery",
    icon: Truck,
    questions: [
      {
        q: "How much does delivery cost?",
        a: "We offer FREE delivery within Nairobi for orders above KSh 10,000. For other orders, delivery fees are calculated based on your location during checkout."
      },
      {
        q: "Do you ship outside Nairobi?",
        a: "Yes! We deliver to all 47 counties in Kenya and offer international shipping via DHL for our global readers."
      }
    ]
  },
  {
    category: "Selling on Nuria",
    icon: User,
    questions: [
      {
        q: "How do I become a vendor?",
        a: "Simply click on 'Sell on Nuria' in the navbar, register your account, and follow the 6-step roadmap in our Vendor Guide to start listing your books."
      },
      {
        q: "When do vendors get paid?",
        a: "We process vendor payouts monthly via M-Pesa. You can track all your sales and pending balances in your Vendor Dashboard."
      }
    ]
  }
];

const FAQsPage = () => {
  return (
    <InfoPageLayout
      label="Support"
      title="Frequently Asked Questions"
      subtitle="Find quick answers to common questions about ordering, delivery, and joining the Nuria Marketplace."
    >
      <div className="max-w-4xl mx-auto space-y-16">
        {faqData.map((section, idx) => (
          <div key={section.category} className="space-y-6">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-[#1B4332]/5 flex items-center justify-center border border-[#1B4332]/10">
                <section.icon className="w-6 h-6 text-[#1B4332]" />
              </div>
              <h3 className="font-display text-2xl font-bold text-[#1A1A1A]">{section.category}</h3>
            </div>

            <Accordion type="single" collapsible className="w-full space-y-4">
              {section.questions.map((item, i) => (
                <AccordionItem 
                  key={item.q} 
                  value={`item-${idx}-${i}`}
                  className="bg-white border border-[#E5E0D8] rounded-2xl px-6 transition-all hover:border-[#A1440B]/30 data-[state=open]:border-[#A1440B] data-[state=open]:shadow-xl data-[state=open]:shadow-black/5"
                >
                  <AccordionTrigger className="font-sans font-bold text-[#1A1A1A] text-left py-6 hover:no-underline hover:text-[#1B4332]">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="font-sans text-[#6B7280] leading-relaxed text-base pb-6">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ))}

        {/* 📞 Still need help? */}
        <div className="bg-[#1B4332] rounded-[2.5rem] p-12 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
          <h3 className="font-display text-3xl font-bold mb-4 relative z-10">Still have questions?</h3>
          <p className="font-sans text-white/80 mb-8 max-w-lg mx-auto relative z-10">
            Didn't find what you were looking for? Our support team is ready to assist you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
            <a 
              href="/contact" 
              className="px-8 py-4 bg-[#A1440B] rounded-xl font-bold text-xs uppercase tracking-widest hover:brightness-90 transition-all"
            >
              Contact Support
            </a>
            <a 
              href="https://wa.me/254794233261" 
              className="px-8 py-4 border border-white/30 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </div>
    </InfoPageLayout>
  );
};

export default FAQsPage;
