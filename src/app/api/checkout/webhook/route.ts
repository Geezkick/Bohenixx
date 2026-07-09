import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db } from '@/lib/db';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock');
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request) {
  try {
    const bodyText = await req.text();
    const sig = req.headers.get('stripe-signature') as string;
    
    let event: Stripe.Event;

    try {
      if (webhookSecret) {
        event = stripe.webhooks.constructEvent(bodyText, sig, webhookSecret);
      } else {
        // Fallback for simulation mode without a webhook secret
        event = JSON.parse(bodyText);
      }
    } catch (err: any) {
      console.error(`Webhook signature verification failed:`, err.message);
      return NextResponse.json({ error: 'Webhook Error' }, { status: 400 });
    }

    // Handle the event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      
      console.log(`[Stripe] Checkout Session completed for ID: ${session.id}`);

      // Update the transaction in our database
      await db.payment.updateMany({
        where: { referenceId: session.id },
        data: { status: 'SUCCESS' },
      });

      const userId = session.client_reference_id || session.metadata?.userId;
      
      if (userId && userId !== 'anonymous') {
        // Upsert UserSubscription
        const planType = session.metadata?.type || 'PREMIUM';
        
        const existingSub = await db.userSubscription.findFirst({
          where: { userId }
        });

        if (existingSub) {
          await db.userSubscription.update({
            where: { id: existingSub.id },
            data: { status: 'ACTIVE', planId: planType }
          });
        } else {
          await db.userSubscription.create({
            data: {
              userId,
              status: 'ACTIVE',
              planId: planType,
            }
          });
        }
        console.log(`[Stripe] UserSubscription activated for user: ${userId}`);
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error(`Webhook Error:`, err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
