import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const flutterwaveKey = Deno.env.get('FLUTTERWAVE_SECRET_KEY');
    if (!flutterwaveKey) {
      return new Response(
        JSON.stringify({ error: 'Flutterwave is not configured yet. Please add your Flutterwave secret key.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const {
      planName,
      facultyId,
      courses,
      benefits,
      learningMode,
      totalAmountNGN,
      currencyCode,
      discountCode,
      successUrl,
      cancelUrl,
    } = await req.json();

    // Calculate total amount from items
    let totalAmount = 0;

    if (courses && courses.length > 0) {
      for (const course of courses) {
        totalAmount += course.price;
      }
    }

    if (learningMode && learningMode.price > 0) {
      totalAmount += learningMode.price;
    }

    if (benefits && benefits.length > 0) {
      for (const benefit of benefits) {
        if (benefit.price > 0) {
          totalAmount += benefit.price;
        }
      }
    }

    if (totalAmount <= 0) {
      return new Response(
        JSON.stringify({ error: 'No items selected for checkout' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Apply discount if valid
    if (discountCode) {
      const code = discountCode.toUpperCase();
      if (code === 'TECHUP50') {
        totalAmount = Math.round(totalAmount * 0.5);
      } else if (code === 'TECHUP25') {
        totalAmount = Math.round(totalAmount * 0.75);
      }
    }

    // Convert to USD if needed
    const amount = currencyCode === 'USD'
      ? Math.round(totalAmount / 1400 * 100) / 100  // NGN to USD with 2 decimal places
      : totalAmount;

    // Build description from items
    const itemNames: string[] = [];
    if (courses) courses.forEach((c: any) => itemNames.push(c.name));
    if (learningMode?.name) itemNames.push(`Mode: ${learningMode.name}`);
    if (benefits) benefits.forEach((b: any) => { if (b.price > 0) itemNames.push(b.name); });

    const txRef = `TF-${facultyId}-${Date.now()}`;

    const flutterwavePayload = {
      tx_ref: txRef,
      amount,
      currency: currencyCode === 'USD' ? 'USD' : 'NGN',
      redirect_url: `${successUrl}?tx_ref=${encodeURIComponent(txRef)}&faculty_id=${encodeURIComponent(facultyId)}&plan=${encodeURIComponent(planName)}`,
      meta: {
        faculty_id: facultyId,
        plan_name: planName,
        discount_code: discountCode || '',
      },
      customer: {
        email: `${facultyId}@techfaculty.ng`,
      },
      customizations: {
        title: 'Tech Faculty',
        description: `${planName} Plan — ${itemNames.join(', ')}`,
        logo: 'https://techup.lovable.app/favicon.ico',
      },
    };

    const flwResponse = await fetch('https://api.flutterwave.com/v3/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${flutterwaveKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(flutterwavePayload),
    });

    const flwData = await flwResponse.json();

    if (flwData.status !== 'success') {
      console.error('Flutterwave error:', flwData);
      return new Response(
        JSON.stringify({ error: flwData.message || 'Failed to create payment link' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ url: flwData.data.link }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Flutterwave checkout error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to create checkout session' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
