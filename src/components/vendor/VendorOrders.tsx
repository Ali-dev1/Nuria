import { useState } from "react";
import { ShoppingCart, Calendar, DollarSign, ChevronRight, PackageCheck } from "lucide-react";
import { formatPrice } from "@/lib/constants";

interface VendorOrdersProps {
  orders: any[];
}

export const VendorOrders = ({ orders }: VendorOrdersProps) => {
  const [statusFilter, setStatusFilter] = useState("all");

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
    confirmed: "bg-blue-100 text-blue-700 border-blue-200",
    shipped: "bg-purple-100 text-purple-700 border-purple-200",
    delivered: "bg-green-100 text-green-700 border-green-200",
    cancelled: "bg-red-100 text-red-700 border-red-200",
  };

  const filteredOrders = statusFilter === "all" ? orders : orders.filter((o) => o.status === statusFilter);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col sm:flex-row items-center justify-between bg-card p-4 rounded-2xl border border-border shadow-sm gap-4">
        <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0 custom-scrollbar">
          {["all", "pending", "confirmed", "shipped", "delivered", "cancelled"].map((s) => (
            <button 
              key={s} 
              onClick={() => setStatusFilter(s)} 
              className={`px-5 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl capitalize transition-all border whitespace-nowrap ${
                statusFilter === s 
                  ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20 scale-[1.02]" 
                  : "bg-background text-muted-foreground border-border hover:border-primary/30 hover:text-foreground"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6 border border-border shadow-inner">
              <ShoppingCart className="w-10 h-10 text-muted-foreground/20" />
            </div>
            <p className="text-muted-foreground font-black uppercase tracking-widest text-xs">No Orders Logged</p>
            <p className="text-[10px] text-muted-foreground mt-1 italic">When customers purchase your items, they'll appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/20">
                  <th className="text-left p-5 font-black text-muted-foreground uppercase tracking-widest text-[10px]">Reference ID</th>
                  <th className="text-left p-5 font-black text-muted-foreground uppercase tracking-widest text-[10px] hidden sm:table-cell">Transaction Date</th>
                  <th className="text-right p-5 font-black text-muted-foreground uppercase tracking-widest text-[10px]">Settlement Amount</th>
                  <th className="text-center p-5 font-black text-muted-foreground uppercase tracking-widest text-[10px]">Current Status</th>
                  <th className="text-right p-5 font-black text-muted-foreground uppercase tracking-widest text-[10px]"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filteredOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="p-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center text-primary shadow-sm group-hover:scale-110 transition-transform">
                          <PackageCheck className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-black text-foreground tracking-tight text-base">#{o.id.slice(0, 8).toUpperCase()}</p>
                          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">{o.customer_name || "Merchant Sale"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-5 text-muted-foreground hidden sm:table-cell">
                      <div className="flex items-center gap-2 font-bold text-xs">
                        <Calendar className="w-3.5 h-3.5 text-primary/40" />
                        {o.created_at ? new Date(o.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : "—"}
                      </div>
                    </td>
                    <td className="p-5 text-right">
                      <div className="font-black text-foreground text-lg tracking-tighter">
                        {formatPrice(Number(o.total))}
                      </div>
                    </td>
                    <td className="p-5 text-center">
                      <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm ${
                        o.status === 'delivered' ? "bg-green-50 text-green-700 border-green-200" :
                        o.status === 'pending' ? "bg-yellow-50 text-yellow-700 border-yellow-200" :
                        o.status === 'cancelled' ? "bg-red-50 text-red-700 border-red-200" :
                        o.status === 'shipped' ? "bg-purple-50 text-purple-700 border-purple-200" :
                        "bg-blue-50 text-blue-700 border-blue-200"
                      }`}>
                        {o.status || "pending"}
                      </span>
                    </td>
                    <td className="p-5 text-right">
                      <button className="p-2.5 bg-background border border-border hover:border-primary/30 rounded-xl text-muted-foreground transition-all group-hover:text-primary shadow-sm">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>

  );
};
