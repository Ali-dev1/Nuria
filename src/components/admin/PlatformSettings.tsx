import React, { useState, useEffect } from "react";
import { Save, Shield, Settings2, Bell, Zap, Globe, Palette, Percent, Wallet, Info, CheckCircle2, AlertTriangle, Activity } from "lucide-react";
import { usePlatformSettings } from "@/hooks/useAdmin";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

export const PlatformSettings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: settingsData, isLoading } = usePlatformSettings();
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settingsData) {
      const s: Record<string, string> = {};
      settingsData.forEach((item: any) => { s[item.key] = item.value; });
      setSettings(s);
    }
  }, [settingsData]);

  const saveSettings = async () => {
    setSaving(true);
    const updates = Object.entries(settings).map(([key, value]) => ({ key, value }));
    const { error } = await supabase.from("platform_settings").upsert(updates);
    
    if (error) {
      toast({ title: "Configuration Error", description: error.message, variant: "destructive" });
    } else {
      queryClient.invalidateQueries({ queryKey: ["admin", "settings"] });
      toast({ title: "Registry Synchronized", description: "Global platform parameters have been updated." });
    }
    setSaving(false);
  };

  if (isLoading) return (
    <div className="space-y-6 animate-pulse">
      <div className="h-64 bg-muted/50 rounded-[2.5rem]" />
      <div className="h-64 bg-muted/50 rounded-[2.5rem]" />
    </div>
  );

  return (
    <div className="max-w-4xl space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-3xl font-black text-foreground tracking-tight">System Core</h2>
          <p className="text-sm text-muted-foreground mt-1 italic">Configure global marketplace protocols and aesthetics</p>
        </div>
        
        <button 
          onClick={saveSettings} 
          disabled={saving} 
          className="flex items-center gap-2 px-8 py-4 bg-[#1B4332] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
        >
          {saving ? <Zap className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? "Synchronizing..." : "Apply Global Changes"}
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Critical Infrastructure */}
        <div className="space-y-8">
          <div className="bg-white p-10 rounded-[2.5rem] border border-border shadow-2xl shadow-primary/5 space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
               <Shield className="w-24 h-24" />
            </div>
            
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-500/10 rounded-2xl border border-red-500/20 text-red-500">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest text-foreground">Infrastructure Gate</h3>
            </div>

            <div className="space-y-8">
              <div className="flex items-center justify-between p-6 bg-muted/10 rounded-3xl border border-border/50 transition-colors hover:border-red-500/30">
                <div className="flex-1 pr-4">
                  <p className="text-sm font-black text-foreground">Maintenance Protocol</p>
                  <p className="text-[10px] text-muted-foreground italic mt-1 leading-relaxed">Enforce platform-wide standby mode. Authorization required.</p>
                </div>
                <button 
                  onClick={() => setSettings({...settings, maintenance_mode: settings.maintenance_mode === "true" ? "false" : "true"})}
                  className={`w-14 h-7 rounded-full transition-all relative flex items-center px-1 ${settings.maintenance_mode === "true" ? "bg-red-500 shadow-lg shadow-red-500/30" : "bg-muted border border-border"}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-all transform ${settings.maintenance_mode === "true" ? "translate-x-7" : "translate-x-0"}`} />
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                   <Bell className="w-3.5 h-3.5 text-muted-foreground" />
                   <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Global Announcement</label>
                </div>
                <div className="relative">
                  <input 
                    value={settings.announcement_text || ""} 
                    onChange={(e) => setSettings({...settings, announcement_text: e.target.value})} 
                    placeholder="Broadcast a system-wide message…"
                    className="w-full pl-6 pr-6 py-4 bg-muted/20 border border-border rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:italic" 
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary animate-pulse" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#1B4332] p-10 rounded-[2.5rem] text-white shadow-2xl shadow-primary/20 space-y-6">
             <div className="flex items-center gap-3 opacity-60">
                <Activity className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Health Diagnostics</span>
             </div>
             <div className="space-y-4">
                <div className="flex justify-between items-end">
                   <span className="text-sm font-bold">API Latency</span>
                   <span className="text-2xl font-black tracking-tighter">12ms</span>
                </div>
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                   <div className="w-[12%] h-full bg-white shadow-[0_0_10px_white]" />
                </div>
             </div>
          </div>
        </div>

        {/* Financial & Marketplace */}
        <div className="space-y-8">
          <div className="bg-white p-10 rounded-[2.5rem] border border-border shadow-2xl shadow-primary/5 space-y-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20 text-amber-500">
                <Percent className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest text-foreground">Economic Engine</h3>
            </div>

            <div className="grid grid-cols-1 gap-8">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                   <Wallet className="w-3.5 h-3.5 text-muted-foreground" />
                   <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Default Commission Yield (%)</label>
                </div>
                <input 
                  type="number" 
                  value={settings.default_commission || "15"} 
                  onChange={(e) => setSettings({...settings, default_commission: e.target.value})} 
                  className="w-full px-6 py-4 bg-muted/20 border border-border rounded-2xl text-sm font-black focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all" 
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                   <CheckCircle2 className="w-3.5 h-3.5 text-muted-foreground" />
                   <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Minimum Disbursement (KSH)</label>
                </div>
                <input 
                  type="number" 
                  value={settings.min_payout || "1000"} 
                  onChange={(e) => setSettings({...settings, min_payout: e.target.value})} 
                  className="w-full px-6 py-4 bg-muted/20 border border-border rounded-2xl text-sm font-black focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all" 
                />
              </div>
            </div>

            <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100 flex gap-4">
               <Info className="w-5 h-5 text-amber-600 shrink-0" />
               <p className="text-[10px] text-amber-800 leading-relaxed font-medium">Changes to economic yields will take effect immediately on all new transactions. Historical data remains cached for 24h.</p>
            </div>
          </div>

          <div className="bg-white p-10 rounded-[2.5rem] border border-border shadow-2xl shadow-primary/5 space-y-6">
             <div className="flex items-center gap-3">
               <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20 text-primary">
                 <Palette className="w-5 h-5" />
               </div>
               <h3 className="text-sm font-black uppercase tracking-widest text-foreground">Platform Aesthetics</h3>
             </div>
             <p className="text-[10px] text-muted-foreground italic leading-relaxed">Global style tokens are locked to the "Nuria Store" Design System. Brand identity overrides are currently disabled in favor of stabilized UX.</p>
             <div className="flex gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#1B4332] shadow-lg border border-white/20" />
                <div className="w-10 h-10 rounded-xl bg-[#2D6A4F] shadow-lg border border-white/20" />
                <div className="w-10 h-10 rounded-xl bg-[#40916C] shadow-lg border border-white/20" />
                <div className="w-10 h-10 rounded-xl bg-foreground shadow-lg border border-white/20" />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
