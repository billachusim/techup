import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeKey) {
      return new Response(
        JSON.stringify({ error: 'Stripe is not configured yet. Please add your Stripe secret key.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const stripe = new Stripe(stripeKey, { apiVersion: '2023-10-16' });

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

    // Build line items
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    // Add courses
    if (courses && courses.length > 0) {
      for (const course of courses) {
        const amount = currencyCode === 'USD'
          ? Math.round(course.price / 1400 * 100) // Convert NGN to USD cents
          : course.price * 100; // NGN to kobo

        lineItems.push({
          price_data: {
            currency: currencyCode.toLowerCase(),
            product_data: {
              name: course.name,
              description: `Tech Faculty - ${planName}`,
            },
            unit_amount: Math.max(amount, currencyCode === 'USD' ? 50 : 5000), // Stripe minimums
          },
          quantity: 1,
        });
      }
    }

    // Add learning mode if it has a price
    if (learningMode && learningMode.price > 0) {
      const modeAmount = currencyCode === 'USD'
        ? Math.round(learningMode.price / 1400 * 100)
        : learningMode.price * 100;

      lineItems.push({
        price_data: {
          currency: currencyCode.toLowerCase(),
          product_data: {
            name: `Learning Mode: ${learningMode.name}`,
            description: learningMode.description || '',
          },
          unit_amount: Math.max(modeAmount, currencyCode === 'USD' ? 50 : 5000),
        },
        quantity: 1,
      });
    }

    // Add benefits
    if (benefits && benefits.length > 0) {
      for (const benefit of benefits) {
        if (benefit.price <= 0) continue;
        const benefitAmount = currencyCode === 'USD'
          ? Math.round(benefit.price / 1400 * 100)
          : benefit.price * 100;

        lineItems.push({
          price_data: {
            currency: currencyCode.toLowerCase(),
            product_data: {
              name: benefit.name,
              description: benefit.description || '',
            },
            unit_amount: Math.max(benefitAmount, currencyCode === 'USD' ? 50 : 5000),
          },
          quantity: 1,
        });
      }
    }

    if (lineItems.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No items selected for checkout' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create checkout session params
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}&faculty_id=${encodeURIComponent(facultyId)}&plan=${encodeURIComponent(planName)}`,
      cancel_url: cancelUrl,
      metadata: {
        faculty_id: facultyId,
        plan_name: planName,
        discount_code: discountCode || '',
        currency: currencyCode,
      },
      customer_email: undefined, // Will be filled if we can look it up
    };

    // Apply discount if valid
    if (discountCode) {
      const code = discountCode.toUpperCase();
      if (code === 'TECHUP50' || code === 'TECHUP25') {
        const percent = code === 'TECHUP50' ? 50 : 25;
        // Create a one-time coupon
        const coupon = await stripe.coupons.create({
          percent_off: percent,
          duration: 'once',
          name: `${code} - ${percent}% OFF`,
        });
        sessionParams.discounts = [{ coupon: coupon.id }];
      }
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    return new Response(
      JSON.stringify({ url: session.url }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to create checkout session' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
