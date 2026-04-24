import React, { useState, useEffect } from "react";
import { 
  Save, Shield, Zap, Bell, Percent, Wallet, CheckCircle2, 
  Truck, Star, Phone, Mail, Globe, Link2,
  AlertTriangle, Eye, EyeOff, Loader2, Check
} from "lucide-react";
import { usePlatformSettings } from "@/hooks/useAdmin";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Switch } from "@/components/ui/switch";

interface PlatformSettingsState {
  maintenance_mode: string;
  announcement_text: string;
  default_commission: string;
  min_payout: string;
  free_delivery_threshold: string;
  loyalty_points_per_kes: string;
  require_vendor_approval: string;
  platform_name: string;
  support_email: string;
  support_phone: string;
  facebook_url: string;
  instagram_url: string;
  twitter_url: string;
}

const defaultSettings: PlatformSettingsState = {
  maintenance_mode: "false",
  announcement_text: "",
  default_commission: "15",
  min_payout: "1000",
  free_delivery_threshold: "3000",
  loyalty_points_per_kes: "1",
  require_vendor_approval: "true",
  platform_name: "Nuria Kenya",
  support_email: "support@nuriakenya.com",
  support_phone: "+254700000000",
  facebook_url: "",
  instagram_url: "",
  twitter_url: "",
};

export const PlatformSettings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: settingsData, isLoading } = usePlatformSettings();
  const [settings, setSettings] = useState<PlatformSettingsState>(defaultSettings);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");

  useEffect(() => {
    if (settingsData) {
      setSettings({ ...defaultSettings, ...settingsData } as PlatformSettingsState);
    }
  }, [settingsData]);

  const updateSetting = (key: keyof PlatformSettingsState, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setSaveStatus("idle");
  };

  const saveSettings = async () => {
    setSaving(true);
    setSaveStatus("idle");
    
    const updates = Object.entries(settings).map(([key, value]) => ({ key, value }));
    const { error } = await supabase.from("platform_settings").upsert(updates);
    
    if (error) {
      toast({ title: "Configuration Error", description: error.message, variant: "destructive" });
      setSaveStatus("error");
    } else {
      queryClient.invalidateQueries({ queryKey: ["admin", "settings"] });
      toast({ title: "Registry Synchronized", description: "Global platform parameters have been updated." });
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 3000);
    }
    setSaving(false);
  };

  if (isLoading) return (
    <div className="space-y-8 animate-pulse">
      <div className="h-32 bg-muted/50 rounded-[2rem]" />
      <div className="grid md:grid-cols-2 gap-8">
        <div className="h-96 bg-muted/50 rounded-[2rem]" />
        <div className="h-96 bg-muted/50 rounded-[2rem]" />
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-3xl font-black text-foreground tracking-tight">System Core</h2>
          <p className="text-sm text-muted-foreground mt-1 italic">Configure global marketplace protocols and aesthetics</p>
        </div>
        
        <button 
          onClick={saveSettings} 
          disabled={saving} 
          className="flex items-center gap-3 px-10 py-5 bg-primary text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : saveStatus === "success" ? <Check className="w-5 h-5" /> : <Save className="w-5 h-5" />}
          {saving ? "Synchronizing..." : saveStatus === "success" ? "Applied" : "Apply Global Changes"}
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Critical Infrastructure */}
        <div className="space-y-8">
          <div className="bg-white p-10 rounded-[2rem] border border-border shadow-2xl shadow-primary/5 space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
               <Shield className="w-32 h-32" />
            </div>
            
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-500/10 rounded-2xl border border-red-500/20 text-red-500">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest text-foreground">Platform Controls</h3>
                <p className="text-[10px] text-muted-foreground mt-0.5">Critical system behavior</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between p-5 bg-muted/10 rounded-2xl border border-border/50 transition-all hover:border-red-500/20">
                <div className="flex-1 pr-4">
                  <div className="flex items-center gap-2 mb-1">
                    {settings.maintenance_mode === "true" ? <EyeOff className="w-4 h-4 text-red-500" /> : <Eye className="w-4 h-4 text-green-500" />}
                    <p className="text-sm font-bold text-foreground">Maintenance Mode</p>
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">Enforce platform-wide standby. Users will see maintenance overlay.</p>
                </div>
                <Switch 
                  checked={settings.maintenance_mode === "true"}
                  onCheckedChange={(checked) => updateSetting("maintenance_mode", checked ? "true" : "false")}
                />
              </div>

              <div className="flex items-center justify-between p-5 bg-muted/10 rounded-2xl border border-border/50 transition-all hover:border-amber-500/20">
                <div className="flex-1 pr-4">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle2 className="w-4 h-4 text-amber-500" />
                    <p className="text-sm font-bold text-foreground">Vendor Approval</p>
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">Require admin approval before vendors can sell.</p>
                </div>
                <Switch 
                  checked={settings.require_vendor_approval === "true"}
                  onCheckedChange={(checked) => updateSetting("require_vendor_approval", checked ? "true" : "false")}
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                   <Bell className="w-4 h-4 text-muted-foreground" />
                   <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Global Announcement</label>
                </div>
                <textarea 
                  value={settings.announcement_text || ""} 
                  onChange={(e) => updateSetting("announcement_text", e.target.value)} 
                  placeholder="Broadcast a system-wide message…"
                  rows={3}
                  className="w-full px-6 py-4 bg-muted/20 border border-border rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:italic resize-none" 
                />
                <p className="text-[9px] text-muted-foreground italic">Shown in the announcement bar on all pages.</p>
              </div>
            </div>
          </div>

          {/* Brand Settings */}
          <div className="bg-white p-10 rounded-[2rem] border border-border shadow-2xl shadow-primary/5 space-y-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20 text-primary">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest text-foreground">Brand Identity</h3>
                <p className="text-[10px] text-muted-foreground mt-0.5">Platform identification</p>
              </div>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Platform Name</label>
                <input 
                  type="text" 
                  value={settings.platform_name} 
                  onChange={(e) => updateSetting("platform_name", e.target.value)}
                  className="w-full px-6 py-4 bg-muted/20 border border-border rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3 h-3 text-muted-foreground" />
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Email</label>
                  </div>
                  <input 
                    type="email" 
                    value={settings.support_email} 
                    onChange={(e) => updateSetting("support_email", e.target.value)}
                    className="w-full px-5 py-3.5 bg-muted/20 border border-border rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all" 
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3 h-3 text-muted-foreground" />
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Phone</label>
                  </div>
                  <input 
                    type="tel" 
                    value={settings.support_phone} 
                    onChange={(e) => updateSetting("support_phone", e.target.value)}
                    className="w-full px-5 py-3.5 bg-muted/20 border border-border rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all" 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Financial & Marketplace */}
        <div className="space-y-8">
          <div className="bg-white p-10 rounded-[2rem] border border-border shadow-2xl shadow-primary/5 space-y-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20 text-amber-500">
                <Percent className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest text-foreground">Financials</h3>
                <p className="text-[10px] text-muted-foreground mt-0.5">Economic parameters</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                   <Wallet className="w-3.5 h-3.5 text-muted-foreground" />
                   <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Commission (%)</label>
                </div>
                <input 
                  type="number" 
                  min="0"
                  max="100"
                  value={settings.default_commission} 
                  onChange={(e) => updateSetting("default_commission", e.target.value)} 
                  className="w-full px-6 py-4 bg-muted/20 border border-border rounded-2xl text-sm font-black focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all" 
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                   <Zap className="w-3.5 h-3.5 text-muted-foreground" />
                   <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Min Payout</label>
                </div>
                <input 
                  type="number" 
                  min="0"
                  value={settings.min_payout} 
                  onChange={(e) => updateSetting("min_payout", e.target.value)} 
                  className="w-full px-6 py-4 bg-muted/20 border border-border rounded-2xl text-sm font-black focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all" 
                />
              </div>
            </div>

            <div className="p-5 bg-amber-50 rounded-2xl border border-amber-100 flex gap-4">
               <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
               <p className="text-[10px] text-amber-800 leading-relaxed font-medium">Changes to economic yields take effect immediately on new transactions. Historical data remains cached for 24h.</p>
            </div>
          </div>

          {/* Delivery Settings */}
          <div className="bg-white p-10 rounded-[2rem] border border-border shadow-2xl shadow-primary/5 space-y-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-500/10 rounded-2xl border border-green-500/20 text-green-500">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest text-foreground">Delivery</h3>
                <p className="text-[10px] text-muted-foreground mt-0.5">Fulfillment parameters</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                 <Truck className="w-3.5 h-3.5 text-muted-foreground" />
                 <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Free Delivery Threshold (KSH)</label>
              </div>
              <input 
                type="number" 
                min="0"
                value={settings.free_delivery_threshold} 
                onChange={(e) => updateSetting("free_delivery_threshold", e.target.value)} 
                className="w-full px-6 py-4 bg-muted/20 border border-border rounded-2xl text-sm font-black focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all" 
              />
              <p className="text-[9px] text-muted-foreground italic">Orders above this amount qualify for free delivery.</p>
            </div>
          </div>

          {/* Loyalty Program */}
          <div className="bg-white p-10 rounded-[2rem] border border-border shadow-2xl shadow-primary/5 space-y-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-500/10 rounded-2xl border border-purple-500/20 text-purple-500">
                <Star className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest text-foreground">Loyalty Program</h3>
                <p className="text-[10px] text-muted-foreground mt-0.5">Rewards configuration</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                 <Star className="w-3.5 h-3.5 text-muted-foreground" />
                 <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Points Per KES Spent</label>
              </div>
              <input 
                type="number" 
                min="0"
                step="0.5"
                value={settings.loyalty_points_per_kes} 
                onChange={(e) => updateSetting("loyalty_points_per_kes", e.target.value)} 
                className="w-full px-6 py-4 bg-muted/20 border border-border rounded-2xl text-sm font-black focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all" 
              />
              <p className="text-[9px] text-muted-foreground italic">Customers earn this many loyalty points per KES spent.</p>
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-white p-10 rounded-[2rem] border border-border shadow-2xl shadow-primary/5 space-y-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20 text-blue-500">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest text-foreground">Social Links</h3>
                <p className="text-[10px] text-muted-foreground mt-0.5">Platform presence</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Link2 className="w-5 h-5 text-blue-600" />
                <input 
                  type="url" 
                  placeholder="Facebook URL"
                  value={settings.facebook_url} 
                  onChange={(e) => updateSetting("facebook_url", e.target.value)} 
                  className="flex-1 px-5 py-3.5 bg-muted/20 border border-border rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/50" 
                />
              </div>

              <div className="flex items-center gap-3">
                <Link2 className="w-5 h-5 text-pink-600" />
                <input 
                  type="url" 
                  placeholder="Instagram URL"
                  value={settings.instagram_url} 
                  onChange={(e) => updateSetting("instagram_url", e.target.value)} 
                  className="flex-1 px-5 py-3.5 bg-muted/20 border border-border rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/50" 
                />
              </div>

              <div className="flex items-center gap-3">
                <Link2 className="w-5 h-5 text-sky-500" />
                <input 
                  type="url" 
                  placeholder="Twitter/X URL"
                  value={settings.twitter_url} 
                  onChange={(e) => updateSetting("twitter_url", e.target.value)} 
                  className="flex-1 px-5 py-3.5 bg-muted/20 border border-border rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/50" 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};