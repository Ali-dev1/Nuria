import { useState } from "react";
import { Save, Upload, User, Store, Mail, Phone, Smartphone } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";

interface VendorSettingsProps {
  vendor: any;
  user: any;
  onRefresh: () => void;
}

export const VendorSettings = ({ vendor, user, onRefresh }: VendorSettingsProps) => {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    store_name: vendor?.store_name || "",
    bio: vendor?.bio || "",
    mpesa_number: vendor?.mpesa_number || "",
    phone: vendor?.phone || "",
    photo_url: vendor?.photo_url || "",
    instagram_url: vendor?.instagram_url || "",
    twitter_url: vendor?.twitter_url || "",
    facebook_url: vendor?.facebook_url || "",
    website_url: vendor?.website_url || "",
  });

  const saveSettings = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("vendors")
        .update({
          store_name: form.store_name,
          bio: form.bio,
          mpesa_number: form.mpesa_number,
          phone: form.phone,
          photo_url: form.photo_url,
          instagram_url: form.instagram_url,
          twitter_url: form.twitter_url,
          facebook_url: form.facebook_url,
          website_url: form.website_url,
        } as any)
        .eq("id", vendor.id);

      if (error) throw error;
      toast({ title: "Settings updated", description: "Your store profile has been saved." });
      onRefresh();
    } catch (err: any) {
      toast({ title: "Update failed", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border bg-muted/20">
          <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
            <Store className="w-5 h-5 text-primary" /> Store Identity
          </h3>
          <p className="text-xs text-muted-foreground mt-1 font-medium italic">Configure how your brand appears to customers.</p>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Store Name</label>
            <div className="relative">
              <Store className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
              <input 
                value={form.store_name} 
                onChange={(e) => setForm(f => ({ ...f, store_name: e.target.value }))} 
                className="w-full pl-10 pr-4 py-3 border border-border rounded-xl text-sm bg-background focus:ring-2 focus:ring-primary/20 transition-all font-medium" 
                placeholder="Nuria Books HQ"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Brand Bio</label>
            <textarea 
              value={form.bio} 
              onChange={(e) => setForm(f => ({ ...f, bio: e.target.value }))} 
              rows={4} 
              className="w-full px-4 py-3 border border-border rounded-xl text-sm bg-background focus:ring-2 focus:ring-primary/20 transition-all resize-none font-medium" 
              placeholder="Tell customers about your specialty or collection..."
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-6 pt-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Public Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
                <input 
                  value={form.phone} 
                  onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))} 
                  className="w-full pl-10 pr-4 py-3 border border-border rounded-xl text-sm bg-background focus:ring-2 focus:ring-primary/20 transition-all font-medium" 
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Store Logo/Photo URL</label>
              <div className="relative">
                <Upload className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
                <input 
                  value={form.photo_url} 
                  onChange={(e) => setForm(f => ({ ...f, photo_url: e.target.value }))} 
                  className="w-full pl-10 pr-4 py-3 border border-border rounded-xl text-sm bg-background focus:ring-2 focus:ring-primary/20 transition-all font-medium" 
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-border">
            <h4 className="text-xs font-black text-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
              Social Links & Presence
            </h4>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Instagram URL</label>
                <input 
                  value={form.instagram_url} 
                  onChange={(e) => setForm(f => ({ ...f, instagram_url: e.target.value }))} 
                  className="w-full px-4 py-3 border border-border rounded-xl text-sm bg-background focus:ring-2 focus:ring-primary/20 transition-all font-medium" 
                  placeholder="https://instagram.com/..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Twitter/X URL</label>
                <input 
                  value={form.twitter_url} 
                  onChange={(e) => setForm(f => ({ ...f, twitter_url: e.target.value }))} 
                  className="w-full px-4 py-3 border border-border rounded-xl text-sm bg-background focus:ring-2 focus:ring-primary/20 transition-all font-medium" 
                  placeholder="https://twitter.com/..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Facebook URL</label>
                <input 
                  value={form.facebook_url} 
                  onChange={(e) => setForm(f => ({ ...f, facebook_url: e.target.value }))} 
                  className="w-full px-4 py-3 border border-border rounded-xl text-sm bg-background focus:ring-2 focus:ring-primary/20 transition-all font-medium" 
                  placeholder="https://facebook.com/..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Website URL</label>
                <input 
                  value={form.website_url} 
                  onChange={(e) => setForm(f => ({ ...f, website_url: e.target.value }))} 
                  className="w-full px-4 py-3 border border-border rounded-xl text-sm bg-background focus:ring-2 focus:ring-primary/20 transition-all font-medium" 
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-border">
            <h4 className="text-xs font-black text-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-primary" /> Disbursement Settings
            </h4>
            <div className="space-y-2 max-w-sm">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Primary M-Pesa Number</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 bg-green-600 rounded-sm" />
                <input 
                  value={form.mpesa_number} 
                  onChange={(e) => setForm(f => ({ ...f, mpesa_number: e.target.value }))} 
                  className="w-full pl-10 pr-4 py-3 border border-border rounded-xl text-sm bg-background focus:ring-2 focus:ring-primary/20 transition-all font-black tracking-widest" 
                  placeholder="254..."
                />
              </div>
              <p className="text-[10px] text-muted-foreground font-medium italic">Verified earnings will be paid to this number automatically.</p>
            </div>
          </div>
        </div>
      </div>

      <button 
        onClick={saveSettings} 
        disabled={saving} 
        className="w-full sm:w-auto px-10 py-4 bg-primary text-primary-foreground font-black rounded-2xl text-sm hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/20 disabled:opacity-50 flex items-center justify-center gap-3"
      >
        <Save className="w-4 h-4" />
        {saving ? "Synchronizing..." : "Save Store Configuration"}
      </button>
    </div>
  );
};
