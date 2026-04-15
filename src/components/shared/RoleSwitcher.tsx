import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

const MOCK_UUIDS: Record<string, string> = {
  admin: "00000000-0000-0000-0000-000000000001",
  vendor: "00000000-0000-0000-0000-000000000002",
  customer: "00000000-0000-0000-0000-000000000003",
};

export const RoleSwitcher = () => {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const savedRole = localStorage.getItem("nuria_test_role");
    setRole(savedRole);
    if (savedRole && !useAuthStore.getState().user) {
      useAuthStore.setState({ 
        user: { 
          id: MOCK_UUIDS[savedRole] || "00000000-0000-0000-0000-000000000000", 
          email: `${savedRole}@nuria.local`,
          user_metadata: { role: savedRole, full_name: `Test ${savedRole}` }
        } as any,
        session: { access_token: "dummy-token", user: {} as any } as any
      });
    }
  }, []);

  const handleRoleChange = (newRole: "customer" | "vendor" | "admin" | null) => {
    if (newRole === null) {
      localStorage.removeItem("nuria_test_role");
      useAuthStore.setState({ user: null, session: null });
    } else {
      localStorage.setItem("nuria_test_role", newRole);
      useAuthStore.setState({ 
        user: { 
          id: MOCK_UUIDS[newRole] || "00000000-0000-0000-0000-000000000000", 
          email: `${newRole}@nuria.local`,
          user_metadata: { role: newRole, full_name: `Test ${newRole}` }
        } as any,
        session: { access_token: "dummy-token", user: {} as any } as any
      });
    }
    setRole(newRole);
    
    // Explicitly navigate tester to the relevant dashboard
    if (newRole === 'admin') window.location.href = '/admin';
    else if (newRole === 'vendor') window.location.href = '/vendor';
    else if (newRole === 'customer') window.location.href = '/account';
    else window.location.reload();
  };

  return (
    <div className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-[100] bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.1)] rounded-full text-white text-[10px] font-sans py-1.5 px-2 flex items-center gap-1">
      <span className="font-bold px-2 uppercase tracking-widest text-white/70">Dev Mode</span>
      <div className="flex bg-black/20 rounded-full p-0.5 border border-white/10">
        <button onClick={() => handleRoleChange(null)} className={`px-3 py-1 rounded-full transition-all duration-300 ${!role ? 'bg-white text-[#1B4332] font-bold shadow-sm' : 'hover:bg-white/10'}`}>Guest</button>
        <button onClick={() => handleRoleChange('admin')} className={`px-3 py-1 rounded-full transition-all duration-300 ${role === 'admin' ? 'bg-white text-[#1B4332] font-bold shadow-sm' : 'hover:bg-white/10'}`}>Admin</button>
        <button onClick={() => handleRoleChange('vendor')} className={`px-3 py-1 rounded-full transition-all duration-300 ${role === 'vendor' ? 'bg-white text-[#1B4332] font-bold shadow-sm' : 'hover:bg-white/10'}`}>Vendor</button>
        <button onClick={() => handleRoleChange('customer')} className={`px-3 py-1 rounded-full transition-all duration-300 ${role === 'customer' ? 'bg-white text-[#1B4332] font-bold shadow-sm' : 'hover:bg-white/10'}`}>Customer</button>
      </div>
    </div>
  );
};
