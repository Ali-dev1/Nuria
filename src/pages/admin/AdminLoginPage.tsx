
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Shield, ArrowRight, Lock } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";

const AdminLoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const signIn = useAuthStore((s) => s.signIn);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { user, error } = await signIn(email, password);
    
    if (error) {
      setLoading(false);
      toast({ title: "Access Denied", description: error, variant: "destructive" });
      return;
    }

    if (user) {
      const { data: profileData } = await supabase
        .from("profiles")
        .select("role")
        .eq("user_id", user.id)
        .single();

      setLoading(false);
      
      if (profileData?.role === "admin") {
        toast({ title: "Identity Verified", description: "Welcome to the Command Center." });
        navigate("/admin");
      } else {
        toast({ title: "Unauthorized", description: "This portal is reserved for administrators.", variant: "destructive" });
        // Sign out if not admin on the admin login page
        await supabase.auth.signOut();
      }
    } else {
      setLoading(false);
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex flex-col items-center justify-center p-4">
      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-secondary/10 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl border border-primary/20 mb-6 group">
            <Shield className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
          </div>
          <h1 className="font-display text-3xl font-bold text-white tracking-tight">Admin Portal</h1>
          <p className="text-slate-400 mt-2 text-sm font-medium">Restricted Access Terminal</p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Identity</label>
              <div className="relative">
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  className="w-full px-4 py-4 bg-slate-950/50 border border-slate-800 rounded-2xl text-white font-sans focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-slate-600"
                  placeholder="admin@nuria.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Passkey</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-4 bg-slate-950/50 border border-slate-800 rounded-2xl text-white font-sans focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all pr-12 placeholder:text-slate-600"
                  placeholder="••••••••"
                />
                <button 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors" 
                  type="button"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button 
              disabled={loading} 
              type="submit" 
              className="w-full py-4 bg-primary text-white font-sans font-bold rounded-2xl hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(27,67,50,0.3)] disabled:opacity-50"
            >
              {loading ? "Authenticating..." : (
                <>
                  Enter System <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between text-[11px] font-bold uppercase tracking-tighter">
            <span className="text-slate-500 flex items-center gap-1.5"><Lock className="w-3 h-3" /> End-to-End Encrypted</span>
            <Link to="/" className="text-slate-400 hover:text-white transition-colors uppercase tracking-widest">Storefront</Link>
          </div>
        </div>

        <p className="text-center mt-10 text-[10px] text-slate-600 font-medium uppercase tracking-[0.2em]">
          Nuria Platform Security Architecture v4.0
        </p>
      </div>
    </div>
  );
};

export default AdminLoginPage;
