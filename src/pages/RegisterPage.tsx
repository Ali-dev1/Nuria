import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");
  const [loading, setLoading] = useState(false);
  const signUp = useAuthStore((s) => s.signUp);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      toast({ title: "Password too short", description: "At least 8 characters required", variant: "destructive" });
      return;
    }
    setLoading(true);
    // You could pass the selected 'role' here if authStore supports it in the future
    const { error } = await signUp(email, password, "New User");
    setLoading(false);
    if (error) {
      toast({ title: "Sign up failed", description: error, variant: "destructive" });
    } else {
      toast({ title: "Account created!", description: "Check your email to confirm your account." });
      navigate("/login");
    }
  };

  const handleGoogleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${import.meta.env.VITE_SITE_URL || globalThis.location.origin}/auth/callback`,
      },
    });
    if (error) {
      toast({ title: "Google sign in failed", description: error.message, variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-20 px-4">
      <div className="w-full max-w-md space-y-10">
        <div className="text-center">
          <Link to="/" className="inline-block">
            <img src="/logo-small.png" alt="Nuria Logo" className="h-14 sm:h-16 w-auto mx-auto" />
          </Link>
          <h1 className="font-display text-2xl font-bold text-foreground mt-10">Register</h1>
          <p className="font-sans text-sm text-muted-foreground mt-4 leading-relaxed text-left">
            Registering for this site allows you to access your order status and history. Just fill in the fields below, and we'll get a new account set up for you in no time. We will only ask you for information necessary to make the purchase process faster and easier.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="reg-email" className="block font-sans text-[13px] font-medium text-foreground mb-1.5">Email address *</label>
            <input id="reg-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-3 border border-border rounded-lg text-sm bg-white font-sans focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="you@example.com" />
          </div>
          <div>
            <label htmlFor="reg-password" className="block font-sans text-[13px] font-medium text-foreground mb-1.5">Password *</label>
            <div className="relative">
              <input
                id="reg-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-border rounded-lg text-sm bg-white font-sans focus:outline-none focus:ring-2 focus:ring-primary/30 pr-10"
                placeholder="••••••••"
              />
              <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" type="button">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="font-sans text-[11px] text-muted-foreground mt-1.5">At least 8 characters</p>
          </div>

          <div className="space-y-3 pt-2">
            <label className="flex items-center gap-3">
              <input 
                type="radio" 
                name="role" 
                value="customer"
                checked={role === "customer"}
                onChange={(e) => setRole(e.target.value)}
                className="w-4 h-4 text-primary border-border focus:ring-primary"
              />
              <span className="font-sans text-sm text-foreground">I am a customer</span>
            </label>
            <label className="flex items-center gap-3">
              <input 
                type="radio" 
                name="role" 
                value="vendor"
                checked={role === "vendor"}
                onChange={(e) => setRole(e.target.value)}
                className="w-4 h-4 text-primary border-border focus:ring-primary"
              />
              <span className="font-sans text-sm text-foreground">I am an Author/Publisher/Reseller/Vendor</span>
            </label>
          </div>

          <button disabled={loading} type="submit" className="w-full py-4 bg-primary text-white font-sans font-bold rounded-lg hover:brightness-90 transition-all text-sm shadow-lg disabled:opacity-50">
            {loading ? "Registering…" : "Register"}
          </button>

          <div className="relative text-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
            <span className="relative bg-background px-3 font-sans text-[11px] uppercase tracking-wider text-muted-foreground font-bold">or</span>
          </div>

          <button type="button" onClick={handleGoogleSignIn} className="w-full py-4 bg-white border border-border rounded-lg font-sans text-sm font-bold text-foreground hover:bg-primary/5 transition-all flex items-center justify-center gap-3">
            <svg className="w-4 h-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Continue with Google
          </button>
        </form>

        <p className="text-center font-sans text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="text-secondary font-bold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
