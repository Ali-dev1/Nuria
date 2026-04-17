import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { phone, amount, orderId } = await req.json();

    // 1. Format Phone (Ensure 254 format)
    let formattedPhone = phone.replace(/\D/g, "");
    if (formattedPhone.startsWith("0")) {
      formattedPhone = "254" + formattedPhone.substring(1);
    } else if (formattedPhone.startsWith("+")) {
      formattedPhone = formattedPhone.substring(1);
    }

    // 2. Daraja Credentials (Sandbox)
    const consumerKey = "1GQjFFKKXWckkCUwMFIj3jrcpKsXW9QaGh1nFWROYSR1a051";
    const consumerSecret = "qw5WvNhAGCbvUPoMQUrUwub6SVjWNSa8ELyqj1tQIsjWv9F6KkcAYrawYeieAFVO";
    const shortcode = "174379";
    const passkey = "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919";
    
    // 3. Get OAuth Token
    const auth = btoa(`${consumerKey}:${consumerSecret}`);
    const tokenRes = await fetch(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        headers: { Authorization: `Basic ${auth}` },
      }
    );
    const { access_token } = await tokenRes.json();

    // 4. Generate STK Push Request
    const timestamp = new Date().toISOString().replace(/[-:T.]/g, "").slice(0, 14);
    const password = btoa(shortcode + passkey + timestamp);

    const stkRes = await fetch(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          BusinessShortCode: shortcode,
          Password: password,
          Timestamp: timestamp,
          TransactionType: "CustomerPayBillOnline",
          Amount: Math.round(amount),
          PartyA: formattedPhone,
          PartyB: shortcode,
          PhoneNumber: formattedPhone,
          CallBackURL: `https://hbfhllfpjhgajxroewpu.supabase.co/functions/v1/mpesa-callback?orderId=${orderId}`,
          AccountReference: `Order-${orderId.substring(0, 8)}`,
          TransactionDesc: "Payment for Nuria Order",
        }),
      }
    );

    const stkData = await stkRes.json();

    return new Response(JSON.stringify(stkData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
