import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/hooks/use-toast";
import { useProfile } from "@/hooks/useProfile";
import { Loader2 } from "lucide-react";

const VendorRegisterPage = () => {
  const { user } = useAuthStore();
  const { data: profile, isLoading: isProfileLoading } = useProfile();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [storeName, setStoreName] = useState("");
  const [bio, setBio] = useState("");
  const [mpesaNumber, setMpesaNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [category, setCategory] = useState("Books");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (isProfileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4">
        <div className="text-center space-y-4">
          <h1 className="font-display text-2xl font-bold text-foreground">Become a Vendor</h1>
          <p className="text-muted-foreground">You need to sign in first</p>
          <Link to="/login" className="inline-block px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg text-sm">Sign In</Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    try {
      // 1. Create the vendor record as 'pending' with ALL details
      const { error: vendorError } = await supabase.from("vendors").upsert({
        user_id: user.id,
        store_name: storeName,
        mpesa_number: mpesaNumber,
        bio: bio,
        phone: phoneNumber,
        category: category,
        is_verified: false,
        status: 'pending',
      }, { onConflict: 'user_id' });

      if (vendorError) throw vendorError;

      // 2. Update role to vendor immediately
      const { error: roleError } = await supabase
        .from("profiles")
        .update({ role: "vendor" })
        .eq("user_id", user.id);

      if (roleError) throw roleError;

      setSubmitted(true);
      toast({ 
        title: "Application Received", 
        description: "We've received your merchant application!" 
      });
    } catch (err: unknown) {
      toast({ title: "Submission Error", description: (err as Error).message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2] p-4">
        <div className="w-full max-w-md bg-white p-12 rounded-[2.5rem] shadow-2xl border border-border text-center space-y-8 animate-in fade-in zoom-in duration-500">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto ring-8 ring-green-50">
            <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
          </div>
          <div className="space-y-4">
            <h1 className="font-display text-3xl font-black text-foreground tracking-tight">Application Submitted</h1>
            <p className="text-muted-foreground leading-relaxed">
              Our team will review your application for <strong>{storeName}</strong> within 24 hours. You will receive an email once approved.
            </p>
          </div>
          <button onClick={() => navigate("/")} className="w-full py-4 bg-primary text-white font-bold rounded-2xl hover:brightness-110 active:scale-[0.98] transition-all text-sm shadow-lg shadow-primary/20">
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-lg bg-white p-10 rounded-[2.5rem] shadow-2xl border border-border relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-primary" />
        
        <div className="text-center mb-10">
          <Link to="/" className="font-display text-4xl font-black text-primary tracking-tighter">NURIA</Link>
          <h1 className="font-display text-2xl font-bold text-foreground mt-8">Merchant Application</h1>
          <p className="text-sm text-muted-foreground mt-2">Join our community of independent sellers</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <label htmlFor="vr-store-name" className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Store Name</label>
              <input 
                id="vr-store-name"
                value={storeName} 
                onChange={(e) => setStoreName(e.target.value)} 
                required 
                className="w-full px-5 py-4 border border-border rounded-2xl text-sm bg-background focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all outline-none" 
                placeholder="e.g. Serengeti Books" 
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="vr-mpesa" className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Payout M-Pesa</label>
                <input 
                  id="vr-mpesa"
                  value={mpesaNumber} 
                  onChange={(e) => setMpesaNumber(e.target.value)} 
                  required
                  className="w-full px-5 py-4 border border-border rounded-2xl text-sm bg-background focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all outline-none" 
                  placeholder="07XX XXX XXX" 
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="vr-phone" className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Contact Phone</label>
                <input 
                  id="vr-phone"
                  value={phoneNumber} 
                  onChange={(e) => setPhoneNumber(e.target.value)} 
                  required
                  className="w-full px-5 py-4 border border-border rounded-2xl text-sm bg-background focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all outline-none" 
                  placeholder="07XX XXX XXX" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="vr-category" className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Primary Category</label>
              <select 
                id="vr-category"
                value={category} 
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-5 py-4 border border-border rounded-2xl text-sm bg-background focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all outline-none appearance-none cursor-pointer"
              >
                <option value="Books">Books</option>
                <option value="Electronics">Electronics</option>
                <option value="Fashion">Fashion</option>
                <option value="General Items">General Items</option>
                <option value="Mixed">Mixed Categories</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="vr-bio" className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Store Bio</label>
              <textarea 
                id="vr-bio"
                value={bio} 
                onChange={(e) => setBio(e.target.value)} 
                required
                rows={3}
                className="w-full px-5 py-4 border border-border rounded-2xl text-sm bg-background focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all outline-none resize-none" 
                placeholder="Tell us about your inventory..." 
              />
            </div>
          </div>

          <button disabled={loading} type="submit" className="w-full py-5 bg-primary text-white font-black rounded-2xl hover:brightness-110 active:scale-[0.98] transition-all text-sm shadow-xl shadow-primary/20 disabled:opacity-50">
            {loading ? "PROCESSING..." : "SUBMIT APPLICATION"}
          </button>
        </form>

        <p className="text-center pt-8">
          <Link to="/" className="text-[10px] font-black text-muted-foreground uppercase tracking-widest hover:text-primary transition-colors">Return to Shop</Link>
        </p>
      </div>
    </div>
  );
};

export default VendorRegisterPage;
