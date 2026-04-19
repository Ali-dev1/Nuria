import { supabase } from "./integrations/supabase/client";

async function check() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.log("No user logged in");
    return;
  }
  console.log("Current User ID:", user.id);

  const { data: profile } = await supabase.from("profiles").select("*").eq("user_id", user.id).single();
  console.log("Profile:", profile);

  // Roles are now in the profile object above

  const { data: vendor } = await supabase.from("vendors").select("*").eq("user_id", user.id).maybeSingle();
  console.log("Vendor Profile:", vendor);

  const { data: products } = await supabase.from("products").select("title, vendor_id").limit(5);
  console.log("Recent Products Sample:", products);
}

check();
