import { CreditCard, Calendar, TrendingUp } from "lucide-react";
import { formatPrice } from "@/lib/constants";

interface VendorPayoutsProps {
  payouts: any[];
  vendor: any;
  currentMonthEarnings: number;
}

export const VendorPayouts = ({ payouts, vendor, currentMonthEarnings }: VendorPayoutsProps) => {
  const commissionRate = vendor?.commission_rate ?? 10;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="grid sm:grid-cols-2 gap-6">
        <div className="bg-card rounded-2xl border border-border p-8 shadow-sm flex flex-col justify-between group hover:border-primary/20 transition-all">
          <div>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">Month-to-Date Accruals</p>
            <p className="text-4xl font-black text-foreground tracking-tighter">{formatPrice(currentMonthEarnings)}</p>
          </div>
          <div className="mt-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-green-600 bg-green-50 border border-green-100 px-3 py-1.5 rounded-lg w-fit shadow-sm">
            <TrendingUp className="w-3.5 h-3.5" />
            Live Ledger Tracking
          </div>
        </div>
        <div className="bg-card rounded-2xl border border-border p-8 shadow-sm flex flex-col justify-between group hover:border-secondary/20 transition-all">
          <div>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">Platform Service Fee</p>
            <p className="text-4xl font-black text-secondary tracking-tighter">{commissionRate}%</p>
          </div>
          <p className="mt-6 text-[10px] text-muted-foreground font-medium italic">
            Standard merchant rate for verified partners.
          </p>
        </div>
      </div>

      <div className="bg-primary/5 border border-primary/10 rounded-2xl p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-inner relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
        <div className="flex items-center gap-6 relative z-10">
          <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary/20 rotate-3 group-hover:rotate-0 transition-transform">
            <CreditCard className="w-7 h-7" />
          </div>
          <div>
            <p className="text-base font-black text-primary tracking-tight">Automated Disbursement Cycle</p>
            <p className="text-[10px] text-primary/60 font-medium uppercase tracking-widest">Next Payout: 1st of the upcoming month</p>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-md border border-white px-6 py-3 rounded-2xl shadow-sm relative z-10 min-w-[200px]">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Settlement Endpoint</p>
          <p className="text-sm font-black text-foreground flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            {vendor?.mpesa_number || "Awaiting Configuration"}
          </p>
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border bg-muted/20 flex items-center justify-between">
          <h3 className="font-black text-foreground uppercase tracking-widest text-xs flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" /> Settlement History
          </h3>
        </div>
        
        {payouts.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6 border border-border shadow-inner">
               <CreditCard className="w-10 h-10 text-muted-foreground/20" />
            </div>
            <p className="text-muted-foreground font-black uppercase tracking-widest text-xs">No History Available</p>
            <p className="text-[10px] text-muted-foreground mt-1 italic uppercase tracking-tighter">Accruals will be reconciled at the end of the billing period.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left p-5 font-black text-muted-foreground uppercase tracking-widest text-[10px]">Fiscal Period</th>
                  <th className="text-right p-5 font-black text-muted-foreground uppercase tracking-widest text-[10px]">Gross Volume</th>
                  <th className="text-right p-5 font-black text-muted-foreground uppercase tracking-widest text-[10px] hidden sm:table-cell">Platform Comm.</th>
                  <th className="text-right p-5 font-black text-muted-foreground uppercase tracking-widest text-[10px]">Net Settlement</th>
                  <th className="text-center p-5 font-black text-muted-foreground uppercase tracking-widest text-[10px]">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {payouts.map((p: any) => (
                  <tr key={p.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="p-5 font-black text-foreground tracking-tight">{p.month}</td>
                    <td className="p-5 text-right text-muted-foreground font-bold">{formatPrice(Number(p.gross_sales))}</td>
                    <td className="p-5 text-right text-red-500 font-bold hidden sm:table-cell">-{formatPrice(Number(p.commission))}</td>
                    <td className="p-5 text-right font-black text-green-600 text-lg tracking-tighter">{formatPrice(Number(p.net_payout))}</td>
                    <td className="p-5 text-center">
                      <span className={`inline-flex px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm ${
                        p.status === "paid" 
                          ? "bg-green-50 text-green-700 border-green-200" 
                          : "bg-yellow-50 text-yellow-700 border-yellow-200"
                      }`}>
                        {p.status}
                      </span>
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
