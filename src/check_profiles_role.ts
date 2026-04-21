import { supabase } from "@/lib/supabaseClient";
async function check() {
  const { data, error } = await supabase.from("profiles").select("role").limit(1);
  console.log("Data:", data);
  console.log("Error:", error);
}
check();
