import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { record } = await req.json(); // Data from Database Webhook

    if (!record?.id) {
      throw new Error("No record found in webhook payload");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY is not set");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 1. Get User Email and Order Details
    const { data: order, error: orderErr } = await supabase
      .from("orders")
      .select(`
        *,
        profiles (email, full_name),
        order_items (
          *,
          products (name)
        )
      `)
      .eq("id", record.id)
      .single();

    if (orderErr || !order) {
      throw new Error(`Failed to fetch order details: ${orderErr?.message}`);
    }

    const userEmail = order.profiles?.email || record.user_email; // Fallback if profile join fails
    if (!userEmail) {
      console.warn("No email found for order", record.id);
      return new Response(JSON.stringify({ message: "No email found" }), { status: 200 });
    }

    // 2. Format Items for Email
    const itemsHtml = order.order_items
      .map((item: Record<string, unknown>) => `<li>${(item.products as Record<string, unknown>)?.name} x ${item.quantity} - KES ${(item.price as number) * (item.quantity as number)}</li>`)
      .join("");

    // 3. Send Email via Resend
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Nuria <noreply@alimukhtarkhadir.com>",
        to: [userEmail],
        subject: `Order Confirmation #${record.id.substring(0, 8)}`,
        html: `
          <h1>Thank you for your order!</h1>
          <p>Hi ${order.profiles?.full_name || 'Customer'},</p>
          <p>Your order <strong>#${record.id}</strong> has been received and is being processed.</p>
          <h3>Order Summary:</h3>
          <ul>${itemsHtml}</ul>
          <p><strong>Total: KES ${order.total}</strong></p>
          <p>Payment Method: ${order.payment_method}</p>
          <p>Shipping to: ${order.shipping_address}</p>
          <br/>
          <p>Best regards,<br/>The Nuria Team</p>
        `,
      }),
    });

    const resData = await res.json();
    console.log("Resend Response:", JSON.stringify(resData));

    return new Response(JSON.stringify(resData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Order Confirmation Error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
