import React, { useState } from "react";
import { Search, CheckCircle, XCircle, Edit, Save, Phone, Store, Info, AlertCircle, Trash2, Loader2 } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";

type ExtendedVendor = Tables<"vendors"> & { profiles?: Tables<"profiles"> };
import { useAdminVendors } from "@/hooks/useAdmin";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

export const VendorManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: vendorsData, isLoading } = useAdminVendors();
  const [vendorSearch, setVendorSearch] = useState("");
  const [rejectVendorId, setRejectVendorId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [editingVendor, setEditingVendor] = useState<{ id: string; rate: number } | null>(null);
  const [selectedVendor, setSelectedVendor] = useState<ExtendedVendor | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin", "vendors"] });

  const verifyVendor = async (id: string, verify: boolean, userId: string) => {
    setProcessingId(id);
    try {
      const { error: vendorError } = await supabase.from("vendors").update({ 
        is_verified: verify,
        status: verify ? "active" : "rejected"
      } as Partial<Tables<"vendors">>).eq("id", id);

      if (vendorError) throw vendorError;

      const { error: profileError } = await supabase.from("profiles").update({ 
        role: verify ? "vendor" : "customer" 
      }).eq("user_id", userId);

      if (profileError) throw profileError;

      await invalidate();
      toast({ title: verify ? "Vendor Approved" : "Vendor Rejected", description: "The platform registry has been updated." });
      setRejectVendorId(null);
      setRejectReason("");
      setSelectedVendor(null);
    } catch (error: any) {
      toast({ title: "Sync Failed", description: error.message, variant: "destructive" });
    } finally {
      setProcessingId(null);
    }
  };

  const deleteVendor = async (id: string) => {
    if (!confirm("Confirm permanent removal of this merchant application? This cannot be undone.")) return;
    setProcessingId(id);
    const { error } = await supabase.from("vendors").delete().eq("id", id);
    if (!error) {
      await invalidate();
      toast({ title: "Application Purged", description: "The merchant record has been removed." });
    } else {
      toast({ title: "Purge Failed", description: error.message, variant: "destructive" });
    }
    setProcessingId(null);
  };

  const updateCommission = async () => {
    if (!editingVendor) return;
    const { error } = await supabase.from("vendors").update({ commission_rate: editingVendor.rate }).eq("id", editingVendor.id);
    if (!error) {
      await invalidate();
      toast({ title: "Commission updated" });
      setEditingVendor(null);
    }
  };

  const filteredVendors = (vendorsData?.data || []).filter((v: ExtendedVendor) => 
    !vendorSearch || v.store_name?.toLowerCase().includes(vendorSearch.toLowerCase())
  );

  const renderVendorTableBody = () => {
    if (isLoading) {
      return [1, 2, 3].map((id) => (
        <tr key={`skeleton-${id}`} className="animate-pulse">
          <td colSpan={5} className="p-6"><div className="h-10 bg-muted rounded-xl w-full" /></td>
        </tr>
      ));
    }
    return filteredVendors.map((v: ExtendedVendor) => (
      <tr key={v.id} className="hover:bg-muted/30 transition-colors group">
        <td className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-[1rem] bg-primary/5 border border-primary/10 flex items-center justify-center text-primary font-black text-sm">
              {v.store_name?.charAt(0)}
            </div>
            <div>
              <p className="font-black text-foreground leading-none mb-1">{v.store_name}</p>
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">ID: {v.id.split('-')[0]}</p>
            </div>
          </div>
        </td>
        <td className="p-6 hidden lg:table-cell">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-bold text-foreground">{v.profiles?.name || "N/A"}</p>
            <p className="text-[10px] text-muted-foreground italic">{v.profiles?.email}</p>
          </div>
        </td>
        <td className="p-6">
          {editingVendor?.id === v.id ? (
            <div className="flex items-center gap-2">
              <input type="number" value={editingVendor.rate} onChange={(e) => setEditingVendor({...editingVendor, rate: Number(e.target.value)})} className="w-16 px-3 py-1.5 border border-primary/20 rounded-lg text-xs font-bold outline-none ring-2 ring-primary/5" />
              <button onClick={updateCommission} className="p-1.5 bg-green-500 text-white rounded-lg shadow-sm hover:brightness-110"><Save className="w-3.5 h-3.5" /></button>
            </div>
          ) : (
            <div className="flex items-center gap-2 group/rate">
              <span className="font-black text-foreground">{v.commission_rate || 10}%</span>
              <button onClick={() => setEditingVendor({ id: v.id, rate: v.commission_rate || 10 })} className="p-1 text-muted-foreground hover:text-primary opacity-0 group-hover/rate:opacity-100 transition-all"><Edit className="w-3 h-3" /></button>
            </div>
          )}
        </td>
        <td className="p-6 text-center">
          {(() => {
            const statusConfig: Record<string, { color: string, icon: React.ReactNode }> = {
              active: { color: "bg-green-100 text-green-700 ring-1 ring-green-200", icon: <CheckCircle className="w-3 h-3" /> },
              rejected: { color: "bg-red-100 text-red-700 ring-1 ring-red-200", icon: <XCircle className="w-3 h-3" /> },
              pending: { color: "bg-amber-100 text-amber-700 ring-1 ring-amber-200", icon: <AlertCircle className="w-3 h-3" /> },
            };
            const config = statusConfig[v.status || "pending"] || statusConfig.pending;
            return (
              <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${config.color}`}>
                {config.icon}
                {v.status || "pending"}
              </span>
            );
          })()}
        </td>
        <td className="p-6 text-right">
          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="outline" size="sm" className="h-9 w-9 p-0 rounded-xl border-border" onClick={() => setSelectedVendor(v)}>
              <Info className="w-4 h-4 text-primary" />
            </Button>
            {v.status === "active" ? (
              <Button variant="outline" size="sm" className="h-9 w-9 p-0 rounded-xl border-red-200 hover:bg-red-50" onClick={() => setRejectVendorId(v.id)}>
                <XCircle className="w-4 h-4 text-red-600" />
              </Button>
            ) : (
              <Button variant="outline" size="sm" className="h-9 w-9 p-0 rounded-xl border-green-200 hover:bg-green-50" onClick={() => verifyVendor(v.id, true, v.user_id)}>
                {processingId === v.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4 text-green-600" />}
              </Button>
            )}
            <Button variant="outline" size="sm" className="h-9 w-9 p-0 rounded-xl border-red-200 hover:bg-red-500 hover:text-white" onClick={() => deleteVendor(v.id)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </td>
      </tr>
    ));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-3xl font-black text-foreground tracking-tight">Merchant Hub</h3>
          <p className="text-sm text-muted-foreground italic mt-1">Manage and approve partner store applications</p>
        </div>
        <div className="relative w-full sm:max-w-sm group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={vendorSearch} onChange={(e) => setVendorSearch(e.target.value)} placeholder="Filter stores..." className="w-full pl-11 pr-4 py-3 border border-border rounded-2xl text-sm bg-white focus:ring-4 focus:ring-primary/5 transition-all shadow-sm" />
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-border shadow-2xl shadow-primary/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/20 text-left">
                <th className="p-6 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Merchant</th>
                <th className="p-6 font-black text-[10px] uppercase tracking-widest text-muted-foreground hidden lg:table-cell">Identity</th>
                <th className="p-6 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Commission</th>
                <th className="p-6 font-black text-[10px] uppercase tracking-widest text-muted-foreground text-center">Lifecycle</th>
                <th className="p-6 font-black text-[10px] uppercase tracking-widest text-muted-foreground text-right">System</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {renderVendorTableBody()}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reject Modal */}
      {rejectVendorId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[110] animate-in fade-in duration-300">
          <div className="bg-white p-10 rounded-[2.5rem] border border-border w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-500">
            <h3 className="text-xl font-black mb-6 tracking-tight">Reject Application</h3>
            <div className="space-y-6">
               <textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder="Reason for rejection (sent to merchant)..." className="w-full h-40 p-6 border border-border rounded-2xl bg-muted/20 text-sm focus:ring-4 focus:ring-primary/5 outline-none transition-all resize-none italic leading-relaxed" />
               <div className="flex justify-end gap-4">
                 <button className="px-6 py-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground" onClick={() => setRejectVendorId(null)}>Cancel</button>
                 <button className="px-10 py-4 bg-red-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-red-500/20 hover:brightness-110 active:scale-95 transition-all" onClick={() => {
                   const vendor = filteredVendors.find(fv => fv.id === rejectVendorId);
                   if (vendor) verifyVendor(rejectVendorId, false, vendor.user_id);
                 }}>Confirm Rejection</button>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal would go here - simplified for this fix */}
    </div>
  );
};
