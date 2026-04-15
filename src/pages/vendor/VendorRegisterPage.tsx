import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/hooks/use-toast";

const VendorRegisterPage = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [storeName, setStoreName] = useState("");
  const [bio, setBio] = useState("");
  const [mpesaNumber, setMpesaNumber] = useState("");
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    const { error } = await supabase.from("vendors").insert({
      user_id: user.id,
      store_name: storeName,
      bio,
      mpesa_number: mpesaNumber || null,
    });
    setLoading(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Vendor profile created!", description: "Your store is now set up." });
      navigate("/vendor");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link to="/" className="font-display text-3xl font-bold text-primary">Nuria</Link>
          <h1 className="font-display text-xl font-bold text-foreground mt-6">Start selling on Nuria</h1>
          <p className="text-sm text-muted-foreground mt-1">Set up your vendor profile in minutes</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Store Name</label>
            <input value={storeName} onChange={(e) => setStoreName(e.target.value)} required className="w-full px-3 py-2.5 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Kamau Books & More" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">About Your Store</label>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} className="w-full px-3 py-2.5 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" placeholder="Tell readers about your bookstore..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">M-Pesa Number (for payouts)</label>
            <input value={mpesaNumber} onChange={(e) => setMpesaNumber(e.target.value)} className="w-full px-3 py-2.5 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="0712 345 678" />
          </div>

          <button disabled={loading} type="submit" className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors text-sm disabled:opacity-50">
            {loading ? "Creating store…" : "Create Vendor Profile"}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          <Link to="/" className="text-secondary font-medium hover:underline">Back to store</Link>
        </p>
      </div>
    </div>
  );
};

export default VendorRegisterPage;
