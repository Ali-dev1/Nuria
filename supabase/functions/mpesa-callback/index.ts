import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  try {
    const url = new URL(req.url);
    const orderId = url.searchParams.get("orderId");

    const body = await req.json();
    console.log(`Received M-Pesa Callback for Order ${orderId}:`, JSON.stringify(body));

    const { ResultCode, ResultDesc, CallbackMetadata } = body.Body.stkCallback;

    if (ResultCode === 0 && orderId) {
      // Payment Successful
      const metadataItems = CallbackMetadata.Item;
      const receiptNumber = metadataItems.find((item: Record<string, unknown>) => item.Name === "MpesaReceiptNumber")?.Value;

      // Update Order Status
      const { error } = await supabase
        .from("orders")
        .update({
          status: "confirmed",
          payment_reference: receiptNumber,
        })
        .eq("id", orderId);

      if (error) throw error;
      console.log(`Order ${orderId} confirmed with receipt ${receiptNumber}`);
    } else {
      console.log(`Order ${orderId} payment failed or cancelled: ${ResultDesc}`);
    }

    return new Response(JSON.stringify({ message: "Success" }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Callback Error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 400,
    });
  }
});
