import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { phone, amount, orderId } = body;

    if (!phone || !amount || !orderId) {
      console.error("Missing required fields:", { phone, amount, orderId });
      return new Response(JSON.stringify({ error: "Missing phone, amount, or orderId" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // 1. Format Phone (Ensure 254 format)
    let formattedPhone = phone.toString().replace(/\D/g, "");
    if (formattedPhone.startsWith("0")) {
      formattedPhone = "254" + formattedPhone.substring(1);
    } else if (formattedPhone.startsWith("+")) {
      formattedPhone = formattedPhone.substring(1);
    }

    // 2. Daraja Credentials (HARDCODED FOR DEFINITIVE FIX)
    const consumerKey = "xlTSTOQcg3G02DWbggB3UfTwEQDyL5AOVfdQ6sJZxCYuiPh6";
    const consumerSecret = Deno.env.get("MPESA_CONSUMER_SECRET");
    const shortcode = "174379";
    const passkey = "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919";

    if (!consumerSecret) {
      console.error("Missing MPESA_CONSUMER_SECRET environment variable");
      return new Response(JSON.stringify({ error: "Server Configuration Error" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }
    
    console.log(`Initiating M-Pesa STK Push for Order: ${orderId}, Phone: ${formattedPhone}, Amount: ${amount}`);

    // 3. Get OAuth Token
    const auth = btoa(`${consumerKey}:${consumerSecret}`);
    const tokenRes = await fetch(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        headers: { Authorization: `Basic ${auth}` },
      }
    );

    if (!tokenRes.ok) {
      const errorText = await tokenRes.text();
      console.error("Daraja OAuth Error:", errorText);
      // Return 200 with error details to avoid browser 401 generic failure
      return new Response(JSON.stringify({ 
        error: "M-Pesa Auth Failed", 
        status: tokenRes.status,
        details: errorText 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200, 
      });
    }

    const tokenData = await tokenRes.json();
    const access_token = tokenData.access_token;

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
    console.log("Daraja Response:", JSON.stringify(stkData));

    return new Response(JSON.stringify(stkData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Function Error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200, // Still return 200 so the frontend can see the custom error object
    });
  }
});

