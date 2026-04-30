import React, { useState, useEffect } from "react";
import { 
  Save, Shield, Bell, Percent, Wallet, 
  Truck, Phone, Mail, Globe, Link2,
  AlertTriangle, Eye, EyeOff, Loader2, Check, CheckCircle2
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
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
      setSaveStatus("error");
    } else {
      queryClient.invalidateQueries({ queryKey: ["admin", "settings"] });
      toast({ title: "Settings saved" });
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 3000);
    }
    setSaving(false);
  };

  if (isLoading) return (
    <div className="space-y-6 animate-pulse">
      <div className="h-24 bg-muted/30 rounded-2xl" />
      <div className="grid md:grid-cols-2 gap-6">
        <div className="h-80 bg-muted/30 rounded-2xl" />
        <div className="h-80 bg-muted/30 rounded-2xl" />
      </div>
    </div>
  );

  const InputField = ({ label, icon: Icon, value, onChange, type = "text", placeholder = "" }: any) => (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
        {Icon && <Icon className="w-3.5 h-3.5" />} {label}
      </label>
      <input 
        type={type}
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 bg-white border border-border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" 
      />
    </div>
  );

  return (
    <div className="max-w-4xl space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-foreground">Settings</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Configure your marketplace</p>
        </div>
        
        <button 
          onClick={saveSettings} 
          disabled={saving} 
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold shadow-sm hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saveStatus === "success" ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saving ? "Saving..." : saveStatus === "success" ? "Saved" : "Save Changes"}
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Platform Controls */}
          <section className="bg-white p-5 md:p-6 rounded-2xl border border-border space-y-5">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-red-50 rounded-lg text-red-500">
                <Shield className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-foreground">Platform Controls</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/20 rounded-xl">
                <div className="flex-1 pr-4">
                  <div className="flex items-center gap-2 mb-0.5">
                    {settings.maintenance_mode === "true" ? <EyeOff className="w-4 h-4 text-red-500" /> : <Eye className="w-4 h-4 text-green-500" />}
                    <p className="text-sm font-semibold text-foreground">Maintenance Mode</p>
                  </div>
                  <p className="text-xs text-muted-foreground">Take the site offline temporarily</p>
                </div>
                <Switch 
                  checked={settings.maintenance_mode === "true"}
                  onCheckedChange={(checked) => updateSetting("maintenance_mode", checked ? "true" : "false")}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/20 rounded-xl">
                <div className="flex-1 pr-4">
                  <div className="flex items-center gap-2 mb-0.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-500" />
                    <p className="text-sm font-semibold text-foreground">Vendor Approval</p>
                  </div>
                  <p className="text-xs text-muted-foreground">Require approval before vendors can sell</p>
                </div>
                <Switch 
                  checked={settings.require_vendor_approval === "true"}
                  onCheckedChange={(checked) => updateSetting("require_vendor_approval", checked ? "true" : "false")}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5" /> Announcement Banner
                </label>
                <textarea 
                  value={settings.announcement_text || ""} 
                  onChange={(e) => updateSetting("announcement_text", e.target.value)} 
                  placeholder="Enter announcement text..."
                  rows={2}
                  className="w-full px-4 py-2.5 bg-white border border-border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none" 
                />
              </div>
            </div>
          </section>

          {/* Brand Identity */}
          <section className="bg-white p-5 md:p-6 rounded-2xl border border-border space-y-5">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Globe className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-foreground">Brand & Contact</h3>
            </div>

            <div className="space-y-4">
              <InputField label="Platform Name" value={settings.platform_name} onChange={(v: string) => updateSetting("platform_name", v)} />
              <div className="grid grid-cols-2 gap-3">
                <InputField label="Email" icon={Mail} value={settings.support_email} onChange={(v: string) => updateSetting("support_email", v)} type="email" />
                <InputField label="Phone" icon={Phone} value={settings.support_phone} onChange={(v: string) => updateSetting("support_phone", v)} type="tel" />
              </div>
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Financial Settings */}
          <section className="bg-white p-5 md:p-6 rounded-2xl border border-border space-y-5">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-amber-50 rounded-lg text-amber-500">
                <Percent className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-foreground">Financial</h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <InputField label="Commission (%)" icon={Wallet} type="number" value={settings.default_commission} onChange={(v: string) => updateSetting("default_commission", v)} />
              <InputField label="Min Payout (KSH)" type="number" value={settings.min_payout} onChange={(v: string) => updateSetting("min_payout", v)} />
            </div>

            <div className="p-3 bg-amber-50 rounded-xl flex gap-3 items-start">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800">Changes take effect immediately on new transactions.</p>
            </div>
          </section>

          {/* Delivery */}
          <section className="bg-white p-5 md:p-6 rounded-2xl border border-border space-y-5">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-green-50 rounded-lg text-green-500">
                <Truck className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-foreground">Delivery</h3>
            </div>
            <InputField label="Free Delivery Threshold (KSH)" icon={Truck} type="number" value={settings.free_delivery_threshold} onChange={(v: string) => updateSetting("free_delivery_threshold", v)} />
            <p className="text-xs text-muted-foreground">Orders above this amount get free delivery.</p>
          </section>

          {/* Loyalty */}
          <section className="bg-white p-5 md:p-6 rounded-2xl border border-border space-y-5">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-purple-50 rounded-lg text-purple-500">
                <Percent className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-foreground">Loyalty Program</h3>
            </div>
            <InputField label="Points Per KES Spent" type="number" value={settings.loyalty_points_per_kes} onChange={(v: string) => updateSetting("loyalty_points_per_kes", v)} />
          </section>

          {/* Social Links */}
          <section className="bg-white p-5 md:p-6 rounded-2xl border border-border space-y-5">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-500">
                <Globe className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-foreground">Social Links</h3>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Link2 className="w-4 h-4 text-blue-600 shrink-0" />
                <input 
                  type="url" placeholder="Facebook URL"
                  value={settings.facebook_url} onChange={(e) => updateSetting("facebook_url", e.target.value)} 
                  className="flex-1 px-4 py-2.5 bg-white border border-border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" 
                />
              </div>
              <div className="flex items-center gap-3">
                <Link2 className="w-4 h-4 text-pink-600 shrink-0" />
                <input 
                  type="url" placeholder="Instagram URL"
                  value={settings.instagram_url} onChange={(e) => updateSetting("instagram_url", e.target.value)} 
                  className="flex-1 px-4 py-2.5 bg-white border border-border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" 
                />
              </div>
              <div className="flex items-center gap-3">
                <Link2 className="w-4 h-4 text-sky-500 shrink-0" />
                <input 
                  type="url" placeholder="Twitter/X URL"
                  value={settings.twitter_url} onChange={(e) => updateSetting("twitter_url", e.target.value)} 
                  className="flex-1 px-4 py-2.5 bg-white border border-border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" 
                />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};