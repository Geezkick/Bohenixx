import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock');

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { itemName, priceAmount, type } = body;

    if (!process.env.STRIPE_SECRET_KEY) {
      // Mock mode if no stripe key provided
      return NextResponse.json({ url: '/command-center?mock_checkout=true' });
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const returnUrl = body.returnUrl || '/dashboard';
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: itemName,
            },
            unit_amount: priceAmount * 100, // Stripe expects cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${baseUrl}${returnUrl}?success=true`,
      cancel_url: `${baseUrl}${returnUrl}?canceled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
