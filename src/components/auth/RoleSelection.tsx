import { useState } from "react";
import { ShoppingCart, Store, ArrowRight, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/hooks/use-toast";

export const RoleSelectScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [selected, setSelected] = useState<"customer" | "vendor" | null>(null);
  const [loading, setLoading] = useState(false);
  const user = useAuthStore((s) => s.user);
  const { toast } = useToast();

  const handleSelection = async () => {
    if (!selected || !user) return;
    setLoading(true);
    
    try {
      // 1. Assign Role
      const { error: roleErr } = await supabase
        .from("user_roles")
        .insert([{ user_id: user.id, role: selected }]);
      
      if (roleErr && !roleErr.message.includes("unique constraint")) throw roleErr;

      // 2. If vendor, create store stub
      if (selected === "vendor") {
        await supabase
          .from("vendors")
          .insert([{ user_id: user.id, store_name: user.user_metadata?.full_name || "My Bookshop" }]);
      }

      // 3. Update profile to clear selection flag
      await supabase
        .from("profiles")
        .update({ needs_role_selection: false })
        .eq("user_id", user.id);

      toast({ title: "Welcome to Nuria!", description: `Account set up as ${selected}.` });
      onComplete();
    } catch (err: any) {
      toast({ title: "Setup failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-background flex items-center justify-center p-6 animate-in fade-in duration-500">
      <div className="max-w-xl w-full text-center space-y-8">
        <div className="space-y-3">
          <h1 className="text-3xl font-display font-bold text-foreground">Complete Your Profile</h1>
          <p className="text-muted-foreground">Welcome to Nuria! How do you plan to use our platform?</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <button
            onClick={() => setSelected("customer")}
            className={`group relative p-8 rounded-2xl border-2 transition-all text-left space-y-4 ${
              selected === "customer" ? "border-primary bg-primary/5 shadow-lg" : "border-border hover:border-primary/50"
            }`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
              selected === "customer" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground group-hover:bg-primary/10"
            }`}>
              <ShoppingCart className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-lg text-foreground">Reader</p>
              <p className="text-sm text-muted-foreground">I want to browse thousands of books and discover my next read.</p>
            </div>
            {selected === "customer" && <Check className="absolute top-4 right-4 w-5 h-5 text-primary" />}
          </button>

          <button
            onClick={() => setSelected("vendor")}
            className={`group relative p-8 rounded-2xl border-2 transition-all text-left space-y-4 ${
              selected === "vendor" ? "border-secondary bg-secondary/5 shadow-lg" : "border-border hover:border-secondary/50"
            }`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
              selected === "vendor" ? "bg-secondary text-secondary-foreground" : "bg-muted text-muted-foreground group-hover:bg-secondary/10"
            }`}>
              <Store className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-lg text-foreground">Vendor</p>
              <p className="text-sm text-muted-foreground">I am an author or publisher looking to reach Kenyan readers.</p>
            </div>
            {selected === "vendor" && <Check className="absolute top-4 right-4 w-5 h-5 text-secondary" />}
          </button>
        </div>

        <button
          onClick={handleSelection}
          disabled={!selected || loading}
          className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? "Setting up..." : "Continue to Storefront"}
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
