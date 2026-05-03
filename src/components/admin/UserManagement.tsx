import React, { useState } from "react";
import { Search, ChevronRight, User, ShieldCheck, Store, Clock, Award } from "lucide-react";
import { useAdminUsers } from "@/hooks/useAdmin";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Tables } from "@/integrations/supabase/types";

type DbProfile = Tables<"profiles">;

export const UserManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("all");
  const [expandedUser, setExpandedUser] = useState<string | null>(null);

  const { data: usersData, isLoading } = useAdminUsers();

  const invalidate = (key: string[]) => queryClient.invalidateQueries({ queryKey: key });

  const changeUserRole = async (userId: string, newRole: string) => {
    const { error } = await supabase.from("profiles").update({ 
      role: newRole as Database["public"]["Enums"]["app_role"] 
    }).eq("user_id", userId);
    if (error) {
      toast({ title: "Failed to update role", description: error.message, variant: "destructive" });
    } else {
      invalidate(["admin", "users"]);
      toast({ title: "Role updated successfully" });
    }
  };

  const users = usersData?.data || [];
  const filteredUsers = (users || []).filter((u: DbProfile) => {
    const role = u.role || "customer";
    const matchesSearch = u.email?.toLowerCase().includes(userSearch.toLowerCase()) || 
                          u.name?.toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole = userRoleFilter === "all" || role === userRoleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin": return "bg-purple-100 text-purple-700 ring-1 ring-purple-200";
      case "vendor": return "bg-blue-100 text-blue-700 ring-1 ring-blue-200";
      default: return "bg-green-100 text-green-700 ring-1 ring-green-200";
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin": return <ShieldCheck className="w-4 h-4" />;
      case "vendor": return <Store className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-3xl font-black text-foreground tracking-tight">Access Control</h2>
          <p className="text-sm text-muted-foreground mt-1 italic">Manage platform identities and permissions</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
            <input 
              value={userSearch} 
              onChange={(e) => setUserSearch(e.target.value)} 
              placeholder="Filter by name or email…" 
              className="w-full sm:w-80 pl-12 pr-4 py-3 border border-border rounded-[1.25rem] text-sm bg-white focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all shadow-sm" 
            />
          </div>
          <div className="flex p-1 bg-muted/30 rounded-[1.25rem] border border-border">
            {["all", "customer", "vendor", "admin"].map((r) => (
              <button 
                key={r} 
                onClick={() => setUserRoleFilter(r)} 
                className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
                  userRoleFilter === r 
                  ? "bg-white text-primary shadow-sm ring-1 ring-border" 
                  : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-border shadow-2xl shadow-primary/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border bg-muted/5">
                <th className="px-8 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Platform User</th>
                <th className="px-8 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest hidden sm:table-cell">Identity Hash</th>
                <th className="px-8 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-center">Authorization</th>
                <th className="px-8 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-right">Loyalty Points</th>
                <th className="px-8 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-right">System</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {isLoading ? (
                ['usk-1', 'usk-2', 'usk-3', 'usk-4', 'usk-5'].map((id) => (
                   <tr key={id} className="animate-pulse">
                     <td colSpan={5} className="px-8 py-8"><div className="h-4 bg-muted/50 rounded-full w-full" /></td>
                   </tr>
                 ))
              ) : (
                filteredUsers.map((u: DbProfile) => {
                  const role = u.role || "customer";
                  const isExpanded = expandedUser === u.user_id;
                  return (
                    <React.Fragment key={u.user_id}>
                      <tr 
                        onClick={() => setExpandedUser(isExpanded ? null : u.user_id)}
                        className={`group cursor-pointer transition-colors ${isExpanded ? "bg-primary/[0.02]" : "hover:bg-muted/10"}`}
                      >
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center text-primary font-black text-lg shadow-inner group-hover:scale-110 transition-transform">
                              {u.name?.charAt(0) || u.email?.charAt(0) || <User className="w-5 h-5" />}
                            </div>
                            <div>
                              <p className="font-bold text-foreground text-sm">{u.name || "Anonymous User"}</p>
                              <p className="text-[10px] text-muted-foreground italic mt-0.5">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6 hidden sm:table-cell">
                          <div className="flex flex-col gap-1">
                            <code className="text-[9px] text-muted-foreground bg-muted/50 px-2 py-1 rounded-lg border border-border/50">ID: {u.user_id.slice(0, 12)}...</code>
                            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-medium italic">
                              <Clock className="w-3 h-3" /> {new Date(u.created_at).toLocaleDateString()}
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-center">
                          <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${getRoleBadge(role)}`}>
                            {getRoleIcon(role)}
                            {role}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <div className="flex items-center justify-end gap-2 text-sm font-black text-foreground">
                            <Award className={`w-4 h-4 ${u.loyalty_points > 100 ? "text-amber-500" : "text-muted-foreground opacity-30"}`} />
                            {u.loyalty_points ?? 0}
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
                          <td colSpan={5} className="px-8 py-10">
                            <div className="grid md:grid-cols-2 gap-12 items-start animate-in zoom-in-95 duration-500">
                               <div className="space-y-6">
                                  <h4 className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] border-l-4 border-primary pl-4">Account Permissions</h4>
                                  <div className="flex flex-wrap gap-3">
                                     {["customer", "vendor", "admin"].map((r) => (
                                        <button
                                           key={r}
                                           onClick={(e) => {
                                              e.stopPropagation();
                                              changeUserRole(u.user_id, r);
                                           }}
                                           disabled={u.role === r}
                                           className={`flex-1 py-4 px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${
                                              u.role === r 
                                              ? "bg-foreground text-background border-foreground shadow-xl" 
                                              : "bg-white text-muted-foreground border-border hover:border-primary/50 hover:text-primary"
                                           }`}
                                        >
                                           Set as {r}
                                        </button>
                                     ))}
                                  </div>
                               </div>
                               <div className="space-y-4">
                                  <h4 className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] border-l-4 border-primary pl-4">Audit Metadata</h4>
                                  <div className="grid grid-cols-2 gap-4">
                                     <div className="p-4 bg-muted/20 rounded-2xl border border-border/50">
                                        <p className="text-[9px] font-black text-muted-foreground uppercase mb-1">Total Spent</p>
                                        <p className="text-sm font-black text-foreground">TBD</p>
                                     </div>
                                     <div className="p-4 bg-muted/20 rounded-2xl border border-border/50">
                                        <p className="text-[9px] font-black text-muted-foreground uppercase mb-1">Orders Count</p>
                                        <p className="text-sm font-black text-foreground">TBD</p>
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
              {!isLoading && filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-8 py-32 text-center">
                    <div className="max-w-xs mx-auto opacity-20">
                       <User className="w-16 h-16 mx-auto mb-4" />
                       <p className="text-sm font-black uppercase tracking-widest">No matching platform identities found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
