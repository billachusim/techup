import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const jsonResponse = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const flutterwaveKey = Deno.env.get('FLUTTERWAVE_SECRET_KEY');
    if (!flutterwaveKey) {
      return jsonResponse({ error: 'Flutterwave is not configured yet. Please add your Flutterwave secret key.' }, 500);
    }

    const {
      planName,
      facultyId,
      courses,
      benefits,
      learningMode,
      currencyCode: rawCurrencyCode,
      discountCode,
      successUrl,
    } = await req.json();

    const currencyCode = (rawCurrencyCode || 'NGN').toUpperCase();

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
      return jsonResponse({ error: 'No items selected for checkout' }, 400);
    }

    if (discountCode) {
      const code = discountCode.toUpperCase();
      if (code === 'TECHUP50') {
        totalAmount = Math.round(totalAmount * 0.5);
      } else if (code === 'TECHUP25') {
        totalAmount = Math.round(totalAmount * 0.75);
      }
    }

    const amount = currencyCode === 'USD'
      ? Math.round(totalAmount / 1400 * 100) / 100
      : totalAmount;

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
        logo: 'https://techfaculty.ng/favicon.png',
      },
    };

    const flwResponse = await fetch('https://api.flutterwave.com/v3/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${flutterwaveKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(flutterwavePayload),
    });

    const rawResponse = await flwResponse.text();
    let flwData: any = null;

    try {
      flwData = rawResponse ? JSON.parse(rawResponse) : null;
    } catch {
      console.error('Flutterwave returned non-JSON response', {
        status: flwResponse.status,
        contentType: flwResponse.headers.get('content-type'),
        bodyPreview: rawResponse.slice(0, 300),
      });

      return jsonResponse(
        { error: 'Payment provider returned an unexpected response. Please try again or use WhatsApp or Email enrollment.' },
        502,
      );
    }

    if (!flwResponse.ok || flwData?.status !== 'success' || !flwData?.data?.link) {
      console.error('Flutterwave error:', {
        status: flwResponse.status,
        data: flwData,
      });

      return jsonResponse(
        { error: flwData?.message || 'Failed to create payment link' },
        flwResponse.ok ? 500 : 502,
      );
    }

    return jsonResponse({ url: flwData.data.link });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create checkout session';
    console.error('Flutterwave checkout error:', error);
    return jsonResponse({ error: message }, 500);
  }
});
