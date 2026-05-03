import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const TwitterIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
    <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
  </svg>
);



export const Footer = () => {
  return (
    <footer className="bg-primary text-white pt-16 pb-8 border-t border-white/10">
      <div className="container-nuria">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Column 1: TALK TO US */}
          <div>
            <h2 className="font-display text-lg font-bold mb-6">TALK TO US</h2>
            <ul className="space-y-4 font-sans text-sm text-white/80">
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                <span>0794 233261 / 0724 670194</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                <span>nuriakenyabookstore@gmail.com</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                <span>The Bazaar Building, 1st Floor</span>
              </li>
            </ul>
          </div>

          {/* Column 2: ABOUT NURIA */}
          <div>
            <h2 className="font-display text-lg font-bold mb-6 underline decoration-secondary decoration-2 underline-offset-8">About Nuria</h2>
            <ul className="space-y-3">
              <li><Link to="/about" className="font-sans text-sm text-white/80 hover:text-white transition-colors">Our Story</Link></li>
              <li><Link to="/blog" className="font-sans text-sm text-white/80 hover:text-white transition-colors">Blog</Link></li>
              <li><Link to="/contact" className="font-sans text-sm text-white/80 hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Column 3: VENDORS */}
          <div>
            <h2 className="font-display text-lg font-bold mb-6 underline decoration-secondary decoration-2 underline-offset-8">VENDORS</h2>
            <ul className="space-y-3">
              <li><Link to="/vendor/guide" className="font-sans text-sm text-white/80 hover:text-white transition-colors">Sell on Nuria</Link></li>
              <li><Link to="/login" className="font-sans text-sm text-white/80 hover:text-white transition-colors">Vendor Login</Link></li>
              <li><Link to="/privacy" className="font-sans text-sm text-white/80 hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Column 4: USEFUL LINKS */}
          <div>
            <h2 className="font-display text-lg font-bold mb-6 underline decoration-secondary decoration-2 underline-offset-8">USEFUL LINKS</h2>
            <ul className="space-y-3">
              <li><Link to="/delivery" className="font-sans text-sm text-white/80 hover:text-white transition-colors">Delivery Policy</Link></li>
              <li><Link to="/returns" className="font-sans text-sm text-white/80 hover:text-white transition-colors">Returns</Link></li>
              <li><Link to="/gift-card" className="font-sans text-sm text-white/80 hover:text-white transition-colors">Gift Card Balance</Link></li>
            </ul>
          </div>
        </div>

        {/* Payment and Apps Row */}
        <div className="flex flex-col lg:flex-row items-center justify-between py-10 border-y border-white/10 gap-8">
          <div className="flex flex-col items-center lg:items-start gap-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/70">We Accept</span>
            <div className="flex flex-wrap items-center justify-center gap-8 opacity-80">
              <div className="bg-[#49b34a] px-2 py-1 rounded flex items-center justify-center min-w-[70px]">
                <span className="text-[11px] font-black text-white tracking-tighter">M-PESA</span>
              </div>
              <span className="font-bold text-lg tracking-tighter">VISA</span>
              <span className="font-bold text-lg tracking-tighter">PesaPal</span>
              <span className="font-bold text-lg tracking-tighter">Bitcoin</span>
            </div>
          </div>
          
          <div className="flex flex-col items-center lg:items-end gap-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/70">Follow Us</span>
            <div className="flex items-center gap-5">
              <a href="https://facebook.com/nuriayourhonestonlineshop/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-white hover:text-secondary transition-colors"><FacebookIcon className="w-6 h-6" /></a>
              <a href="https://instagram.com/nuria_thehoneststore/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-white hover:text-secondary transition-colors"><InstagramIcon className="w-6 h-6" /></a>
              <a href="https://x.com/nuriastore" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-white hover:text-secondary transition-colors"><TwitterIcon className="w-6 h-6" /></a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex justify-center">
          <p className="font-sans text-[12px] text-white/60 tracking-wide text-center">
            © 2025 Nuria Kenya. All rights reserved. Home of African Books.
          </p>
        </div>
      </div>
    </footer>
  );
};
