import React, { useState } from "react";
import { Search, CheckCircle, XCircle, Edit, Save, Phone, Tag, Store, Info, AlertCircle } from "lucide-react";
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
  const [selectedVendor, setSelectedVendor] = useState<any | null>(null);

  const invalidate = (key: any[]) => queryClient.invalidateQueries({ queryKey: key });

  const verifyVendor = async (id: string, verify: boolean, userId: string) => {
    const { error: vendorError } = await supabase.from("vendors").update({ 
      is_verified: verify,
      status: verify ? "active" : "rejected",
      admin_notes: verify ? null : rejectReason
    } as any).eq("id", id);

    if (vendorError) {
      toast({ title: "Operation failed", description: vendorError.message, variant: "destructive" });
      return;
    }

    const { error: profileError } = await supabase.from("profiles").update({ 
      role: verify ? "vendor" : "customer" 
    }).eq("user_id", userId);

    if (profileError) {
      toast({ title: "Profile sync failed", description: profileError.message, variant: "destructive" });
    } else {
      invalidate(["admin", "vendors"]);
      toast({ title: verify ? "Vendor Approved & Role Granted" : "Vendor Rejected/Suspended" });
      setRejectVendorId(null);
      setRejectReason("");
      setSelectedVendor(null);
    }
  };

  const updateCommission = async () => {
    if (!editingVendor) return;
    const { error } = await supabase.from("vendors").update({ commission_rate: editingVendor.rate }).eq("id", editingVendor.id);
    if (!error) {
      invalidate(["admin", "vendors"]);
      toast({ title: "Commission updated" });
      setEditingVendor(null);
    }
  };

  const filteredVendors = (vendorsData?.data || []).filter((v: any) => 
    !vendorSearch || v.store_name?.toLowerCase().includes(vendorSearch.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-black text-foreground tracking-tight">Merchant Hub</h3>
          <p className="text-xs text-muted-foreground">Manage and approve partner store applications</p>
        </div>
        <div className="relative w-full sm:max-w-sm group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input 
            value={vendorSearch} 
            onChange={(e) => setVendorSearch(e.target.value)} 
            placeholder="Search stores..." 
            className="w-full pl-10 pr-4 py-2.5 border border-border rounded-xl text-sm bg-white focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all shadow-sm" 
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30 text-left">
                <th className="p-4 font-bold text-[10px] uppercase tracking-widest text-muted-foreground">Store Details</th>
                <th className="p-4 font-bold text-[10px] uppercase tracking-widest text-muted-foreground hidden lg:table-cell">Contact & Category</th>
                <th className="p-4 font-bold text-[10px] uppercase tracking-widest text-muted-foreground">Rate</th>
                <th className="p-4 font-bold text-[10px] uppercase tracking-widest text-muted-foreground text-center">Status</th>
                <th className="p-4 font-bold text-[10px] uppercase tracking-widest text-muted-foreground text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="p-6"><div className="h-10 bg-muted rounded-xl w-full" /></td>
                  </tr>
                ))
              ) : filteredVendors.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-20 text-center">
                    <div className="flex flex-col items-center gap-3 opacity-20">
                      <Store className="w-12 h-12" />
                      <p className="font-bold uppercase tracking-widest text-xs">No merchants found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredVendors.map((v: any) => (
                  <tr key={v.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center text-primary font-black text-xs">
                          {v.store_name?.charAt(0)}
                        </div>
                        <div>
                          <p className="font-black text-foreground leading-none mb-1">{v.store_name}</p>
                          <p className="text-[10px] text-muted-foreground font-medium truncate max-w-[150px]">ID: {v.id.split('-')[0]}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 hidden lg:table-cell">
                      <div className="flex flex-col gap-1">
                        <p className="text-sm font-bold text-foreground">{v.profiles?.name || "N/A"}</p>
                        <p className="text-[10px] text-muted-foreground italic">{v.profiles?.email}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      {editingVendor?.id === v.id ? (
                        <div className="flex items-center gap-2">
                          <input 
                            type="number" 
                            value={editingVendor.rate} 
                            onChange={(e) => setEditingVendor({...editingVendor, rate: Number(e.target.value)})} 
                            className="w-16 px-3 py-1.5 border border-primary/20 rounded-lg text-xs font-bold outline-none ring-2 ring-primary/5" 
                          />
                          <button onClick={updateCommission} className="p-1.5 bg-green-500 text-white rounded-lg shadow-sm hover:brightness-110"><Save className="w-3.5 h-3.5" /></button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 group/rate">
                          <span className="font-black text-foreground">{v.commission_rate || 10}%</span>
                          <button onClick={() => setEditingVendor({ id: v.id, rate: v.commission_rate || 10 })} className="p-1 text-muted-foreground hover:text-primary opacity-0 group-hover/rate:opacity-100 transition-all"><Edit className="w-3 h-3" /></button>
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        v.status === "active" ? "bg-green-100 text-green-700 ring-1 ring-green-200" : 
                        v.status === "rejected" ? "bg-red-100 text-red-700 ring-1 ring-red-200" :
                        "bg-amber-100 text-amber-700 ring-1 ring-amber-200 animate-pulse"
                      }`}>
                        {v.status === "active" ? <CheckCircle className="w-3 h-3" /> : v.status === "rejected" ? <XCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                        {v.status || "pending"}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 w-8 p-0 rounded-lg border-primary/20"
                          onClick={() => setSelectedVendor(v)}
                        >
                          <Info className="w-4 h-4 text-primary" />
                        </Button>
                        {v.status !== "active" ? (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 w-8 p-0 rounded-lg border-green-200 hover:bg-green-50"
                            onClick={() => verifyVendor(v.id, true, v.user_id)}
                          >
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          </Button>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 w-8 p-0 rounded-lg border-red-200 hover:bg-red-50"
                            onClick={() => verifyVendor(v.id, false, v.user_id)}
                          >
                            <XCircle className="w-4 h-4 text-red-600" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail View Modal */}
      {selectedVendor && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100] animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl border border-border overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
              <div className="p-8 space-y-8">
                 <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                       <div className="w-16 h-16 rounded-[1.5rem] bg-primary/5 border border-primary/10 flex items-center justify-center text-primary font-black text-2xl shadow-inner">
                          {selectedVendor.store_name?.charAt(0)}
                       </div>
                       <div>
                          <h4 className="text-2xl font-black text-foreground tracking-tight">{selectedVendor.store_name}</h4>
                          <span className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest mt-1 ${
                            selectedVendor.status === "active" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                          }`}>
                            {selectedVendor.status || "pending"}
                          </span>
                       </div>
                    </div>
                    <button onClick={() => setSelectedVendor(null)} className="p-2 hover:bg-muted rounded-full transition-colors">
                       <XCircle className="w-6 h-6 text-muted-foreground" />
                    </button>
                 </div>

                 <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-1">
                       <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Merchant Profile</p>
                       <p className="font-bold text-foreground">{selectedVendor.profiles?.name || "N/A"}</p>
                       <p className="text-[10px] text-muted-foreground italic">{selectedVendor.profiles?.email}</p>
                    </div>
                    <div className="space-y-1">
                       <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Phone Number</p>
                       <p className="font-bold text-foreground flex items-center gap-2"><Phone className="w-4 h-4 text-primary" /> {selectedVendor.phone || "No contact"}</p>
                    </div>
                 </div>

                 <div className="space-y-2">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Store Bio</p>
                    <div className="p-4 bg-muted/30 rounded-2xl border border-border text-sm text-muted-foreground italic leading-relaxed">
                       "{selectedVendor.bio || "No description provided by the merchant."}"
                    </div>
                 </div>

                 <div className="flex gap-4 pt-4">
                    {selectedVendor.status !== "active" ? (
                       <Button 
                          className="flex-1 h-14 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-primary/20"
                          onClick={() => verifyVendor(selectedVendor.id, true, selectedVendor.user_id)}
                       >
                          Approve Merchant
                       </Button>
                    ) : (
                       <Button 
                          variant="destructive"
                          className="flex-1 h-14 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-red-500/20"
                          onClick={() => verifyVendor(selectedVendor.id, false, selectedVendor.user_id)}
                       >
                          Suspend Merchant
                       </Button>
                    )}
                    <Button 
                       variant="outline"
                       className="h-14 px-8 rounded-2xl font-black uppercase tracking-widest text-xs border-primary/20"
                       onClick={() => setRejectVendorId(selectedVendor.id)}
                    >
                       Reject
                    </Button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectVendorId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[110] animate-in fade-in duration-300">
          <div className="bg-white p-8 rounded-[2.5rem] border border-border w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-500">
            <h3 className="text-xl font-black mb-6 tracking-tight">Reject Merchant Application</h3>
            <div className="space-y-4">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Reason for Rejection</label>
                  <textarea 
                    value={rejectReason} 
                    onChange={(e) => setRejectReason(e.target.value)} 
                    placeholder="Provide clear feedback to the merchant..." 
                    className="w-full h-40 p-4 border border-border rounded-2xl bg-muted/30 text-sm focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all outline-none resize-none leading-relaxed" 
                  />
               </div>
               <div className="flex justify-end gap-3 pt-4">
                 <Button variant="ghost" className="font-bold text-xs" onClick={() => setRejectVendorId(null)}>CANCEL</Button>
                 <Button 
                    variant="destructive" 
                    className="px-8 rounded-xl font-black text-xs shadow-lg shadow-red-500/20"
                    onClick={() => {
                      const vendor = filteredVendors.find(fv => fv.id === rejectVendorId);
                      if (vendor) verifyVendor(rejectVendorId, false, vendor.user_id);
                    }}
                 >
                    CONFIRM REJECTION
                 </Button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
