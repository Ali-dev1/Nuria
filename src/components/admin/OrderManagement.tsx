import React, { useState } from "react";
import { Download, ChevronRight, Hash, Clock, CreditCard, Box, CheckCircle2, AlertCircle, Truck, XCircle, FileText } from "lucide-react";
import { formatPrice } from "@/lib/constants";
import { useAdminOrders, useOrderItems } from "@/hooks/useAdmin";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const statusConfig: Record<string, { color: string, icon: React.ReactNode }> = {
  pending: { color: "bg-amber-100 text-amber-700 ring-1 ring-amber-200", icon: <Clock className="w-3 h-3" /> },
  confirmed: { color: "bg-blue-100 text-blue-700 ring-1 ring-blue-200", icon: <CheckCircle2 className="w-3 h-3" /> },
  shipped: { color: "bg-purple-100 text-purple-700 ring-1 ring-purple-200", icon: <Truck className="w-3 h-3" /> },
  delivered: { color: "bg-green-100 text-green-700 ring-1 ring-green-200", icon: <CheckCircle2 className="w-3 h-3" /> },
  cancelled: { color: "bg-red-100 text-red-700 ring-1 ring-red-200", icon: <XCircle className="w-3 h-3" /> },
};

const OrderDetails = ({ orderId }: { orderId: string }) => {
  const { data: items, isLoading } = useOrderItems(orderId);
  
  if (isLoading) return (
    <div className="space-y-3">
      {[1, 2].map(i => <div key={`skeleton-filter-${i}`} className="h-10 bg-muted/50 rounded-xl animate-pulse" />)}
    </div>
  );

  if (!items || items.length === 0) return (
    <div className="p-8 text-center bg-muted/20 rounded-2xl border border-dashed border-border">
      <p className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-50">No Line Items Detected</p>
    </div>
  );

  return (
    <div className="space-y-3">
      {items.map((item: any) => (
        <div key={item.id} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-border/50 shadow-sm group hover:border-primary/30 transition-all">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 rounded-xl bg-muted/30 flex items-center justify-center">
                <Box className="w-5 h-5 text-muted-foreground opacity-40" />
             </div>
             <div>
                <p className="text-sm font-bold text-foreground line-clamp-1">{item.products?.title}</p>
                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-0.5">Quantity: {item.quantity}</p>
             </div>
          </div>
          <div className="text-right">
             <p className="text-sm font-black text-foreground">{formatPrice(item.unit_price)}</p>
             <p className="text-[9px] text-muted-foreground font-medium italic">Unit Price</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export const OrderManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [orderPage, setOrderPage] = useState(1);
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  
  const { data: ordersData, isLoading } = useAdminOrders({ page: orderPage, pageSize: 10 });

  const invalidate = (key: any[]) => queryClient.invalidateQueries({ queryKey: key });

  const updateOrderStatus = async (orderId: string, status: string) => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", orderId);
    if (error) {
      toast({ title: "Operation Failed", description: error.message, variant: "destructive" });
    } else {
      // Aggressive multi-level invalidation to force UI update
      await queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
      await queryClient.refetchQueries({ queryKey: ["admin", "orders"] });
      
      toast({ title: "Status Synchronized", description: `Registry updated to ${status}.` });
    }
  };

  const exportOrdersCSV = () => {
    const data = ordersData?.data || [];
    const filtered = orderStatusFilter === "all" ? data : data.filter((o: any) => o.status === orderStatusFilter);
    const csv = ["Order ID,Date,Total,Status,Payment Method,User ID"];
    filtered.forEach((o: any) => {
      csv.push(`${o.id},${o.created_at || ""},${o.total},${o.status || "pending"},${o.payment_method || ""},${o.user_id}`);
    });
    const blob = new Blob([csv.join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `nuria_orders_export_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    toast({ title: "Report Generated", description: "Marketplace order log exported to CSV." });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-3xl font-black text-foreground tracking-tight">Fulfillment Ledger</h2>
          <p className="text-sm text-muted-foreground mt-1 italic">Real-time platform transaction oversight</p>
        </div>
        
        <div className="flex flex-wrap gap-4 w-full md:w-auto">
          <div className="flex p-1 bg-muted/30 rounded-[1.25rem] border border-border">
            {["all", "pending", "confirmed", "shipped", "delivered"].map((s) => (
              <button 
                key={s} 
                onClick={() => setOrderStatusFilter(s)} 
                className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
                  orderStatusFilter === s 
                  ? "bg-white text-primary shadow-sm ring-1 ring-border" 
                  : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <button 
            onClick={exportOrdersCSV} 
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-foreground rounded-2xl text-[10px] font-black uppercase tracking-widest border border-border hover:bg-muted/50 transition-all shadow-sm active:scale-95"
          >
            <Download className="w-4 h-4" /> Export Registry
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-[2.5rem] border border-border shadow-2xl shadow-primary/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border bg-muted/5">
                <th className="px-8 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Transaction Hash</th>
                <th className="px-8 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest hidden sm:table-cell">Temporal Data</th>
                <th className="px-8 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest hidden sm:table-cell">Identity</th>
                <th className="px-8 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-right">Total Value</th>
                <th className="px-8 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-center">Fulfillment</th>
                <th className="px-8 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-right">System</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {isLoading ? (
                ['osk-1', 'osk-2', 'osk-3', 'osk-4', 'osk-5', 'osk-6'].map((id) => (
                  <tr key={id} className="animate-pulse">
                    <td className="px-8 py-8" colSpan={6}><div className="h-4 w-full bg-muted/50 rounded-full" /></td>
                  </tr>
                ))
              ) : (
                (ordersData?.data || []).map((o: any) => {
                  const isExpanded = expandedOrder === o.id;
                  const currentStatus = o.status || "pending";
                  const config = statusConfig[currentStatus] || statusConfig.pending;
                  
                  return (
                    <React.Fragment key={o.id}>
                      <tr 
                        onClick={() => setExpandedOrder(isExpanded ? null : o.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setExpandedOrder(isExpanded ? null : o.id);
                          }
                        }}
                        tabIndex={0}
                        className={`group cursor-pointer transition-colors ${isExpanded ? "bg-primary/[0.02]" : "hover:bg-muted/10"}`}
                      >
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary border border-primary/10">
                                 <Hash className="w-4 h-4" />
                              </div>
                              <span className="font-black text-sm tracking-tighter text-foreground">#{o.id.slice(0, 8).toUpperCase()}</span>
                           </div>
                        </td>
                        <td className="px-8 py-6 hidden sm:table-cell">
                           <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground italic">
                              <Clock className="w-3.5 h-3.5" />
                              {o.created_at ? new Date(o.created_at).toLocaleDateString() : "Pending Registry"}
                           </div>
                        </td>
                        <td className="px-8 py-6 hidden sm:table-cell">
                           <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground border border-border">
                                 {o.profiles?.name?.charAt(0) || "U"}
                              </div>
                              <span className="text-xs font-bold text-foreground truncate max-w-[120px]">{o.profiles?.name || "Anonymous Entity"}</span>
                           </div>
                        </td>
                        <td className="px-8 py-6 text-right font-black text-foreground text-sm tracking-tight">
                           {formatPrice(Number(o.total))}
                        </td>
                        <td className="px-8 py-6 text-center">
                           <div className="flex justify-center">
                              <select 
                                onClick={(e) => e.stopPropagation()}
                                value={currentStatus} 
                                onChange={(e) => updateOrderStatus(o.id, e.target.value)} 
                                className={`text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border-none focus:ring-4 focus:ring-primary/10 transition-all cursor-pointer shadow-sm appearance-none text-center min-w-[120px] ${config.color}`}
                              >
                                {["pending", "confirmed", "shipped", "delivered", "cancelled"].map((s) => (
                                   <option key={s} value={s} className="bg-white text-foreground">{s}</option>
                                ))}
                              </select>
                           </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                           <div className="p-2 text-muted-foreground group-hover:text-primary transition-colors inline-block bg-muted/20 rounded-xl">
                              <ChevronRight className={`w-5 h-5 transition-transform duration-500 ${isExpanded ? "rotate-90" : ""}`} />
                           </div>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr className="bg-primary/[0.01]">
                          <td colSpan={6} className="px-8 py-12">
                            <div className="grid lg:grid-cols-3 gap-12 animate-in zoom-in-95 duration-500">
                               <div className="lg:col-span-2 space-y-6">
                                  <h4 className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] border-l-4 border-primary pl-4">Manifest Line Items</h4>
                                  <OrderDetails orderId={o.id} />
                               </div>
                               <div className="space-y-8">
                                  <div className="space-y-4">
                                     <h4 className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] border-l-4 border-primary pl-4">Transaction Intelligence</h4>
                                     <div className="space-y-3">
                                        <div className="p-5 bg-white rounded-2xl border border-border shadow-sm flex items-center justify-between">
                                           <div className="flex items-center gap-3">
                                              <CreditCard className="w-5 h-5 text-muted-foreground opacity-40" />
                                              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Settlement</span>
                                           </div>
                                           <span className="text-xs font-black text-foreground capitalize">{o.payment_method || "Pending"}</span>
                                        </div>
                                        <div className="p-5 bg-white rounded-2xl border border-border shadow-sm flex items-center justify-between">
                                           <div className="flex items-center gap-3">
                                              <FileText className="w-5 h-5 text-muted-foreground opacity-40" />
                                              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Reference</span>
                                           </div>
                                           <span className="text-[10px] font-mono text-muted-foreground bg-muted/50 px-2 py-1 rounded-lg">{o.payment_reference?.slice(0, 12) || "NULL_PTR"}</span>
                                        </div>
                                     </div>
                                  </div>
                                  
                                  <div className="p-8 bg-primary rounded-[2rem] text-white shadow-xl shadow-primary/20">
                                     <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Total Settlement Value</p>
                                     <p className="text-4xl font-black tracking-tighter">{formatPrice(Number(o.total))}</p>
                                     <div className="mt-6 flex items-center gap-2 p-3 bg-white/10 rounded-xl border border-white/10">
                                        <AlertCircle className="w-4 h-4" />
                                        <span className="text-[10px] font-bold italic">Verify funds before shipment</span>
                                     </div>
                                  </div>
                               </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {(ordersData?.count ?? 0) > 10 && (
        <div className="flex justify-center mt-12 animate-in slide-in-from-top-4 duration-1000">
          <Pagination className="bg-white p-2 rounded-2xl border border-border shadow-xl shadow-primary/5">
            <PaginationContent className="gap-2">
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setOrderPage(p => Math.max(1, p - 1))}
                  className={`${orderPage === 1 ? "pointer-events-none opacity-20" : "cursor-pointer hover:bg-primary/10 text-primary"} border-none rounded-xl font-black uppercase tracking-widest text-[10px] px-6 transition-all`}
                />
              </PaginationItem>
              
              {Array.from({ length: Math.ceil(ordersData.count / 10) }).map((_, i) => (
                <PaginationItem key={`page-${i + 1}`}>
                  <PaginationLink 
                    onClick={() => setOrderPage(i + 1)}
                    isActive={orderPage === i + 1}
                    className={`cursor-pointer w-10 h-10 rounded-xl font-black text-xs transition-all ${
                      orderPage === i + 1 
                      ? "bg-primary text-white shadow-lg shadow-primary/30 ring-0" 
                      : "hover:bg-muted border-none"
                    }`}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext 
                  onClick={() => setOrderPage(p => p + 1)}
                  className={`${orderPage >= Math.ceil(ordersData.count / 10) ? "pointer-events-none opacity-20" : "cursor-pointer hover:bg-primary/10 text-primary"} border-none rounded-xl font-black uppercase tracking-widest text-[10px] px-6 transition-all`}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};
