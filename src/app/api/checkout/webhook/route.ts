import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/lib/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-04-10" as any,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature") || "";

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: "Webhook Error" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode === "subscription" && session.subscription && session.customer_email) {
          const subscriptionId = typeof session.subscription === "string" ? session.subscription : session.subscription.id;
          const customerId = typeof session.customer === "string" ? session.customer : session.customer?.id || "";

          // Retrieve the full subscription to get period end
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          const priceId = subscription.items.data[0]?.price?.id || "";
          const currentPeriodEnd = new Date(subscription.current_period_end * 1000);

          // Find the user by email
          const user = await db.user.findUnique({
            where: { email: session.customer_email },
          });

          if (user) {
            // Update user with Stripe fields
            await db.user.update({
              where: { id: user.id },
              data: {
                stripeCustomerId: customerId,
                stripeSubscriptionId: subscriptionId,
                stripePriceId: priceId,
                stripeCurrentPeriodEnd: currentPeriodEnd,
              },
            });

            // Upsert the Subscription record
            await db.subscription.upsert({
              where: { userId: user.id },
              create: {
                userId: user.id,
                stripeCustomerId: customerId,
                stripeSubscriptionId: subscriptionId,
                stripePriceId: priceId,
                stripeCurrentPeriodEnd: currentPeriodEnd,
                status: "active",
              },
              update: {
                stripeCustomerId: customerId,
                stripeSubscriptionId: subscriptionId,
                stripePriceId: priceId,
                stripeCurrentPeriodEnd: currentPeriodEnd,
                status: "active",
              },
            });

            // Log the activity
            await db.activityLog.create({
              data: {
                userId: user.id,
                app: "Billing",
                action: `Subscribed to ${session.metadata?.plan || "Flow AI"} plan`,
                color: "#22c55e",
              },
            });
          }
        }
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = typeof invoice.subscription === "string" ? invoice.subscription : invoice.subscription?.id;

        if (subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          const currentPeriodEnd = new Date(subscription.current_period_end * 1000);

          await db.subscription.updateMany({
            where: { stripeSubscriptionId: subscriptionId },
            data: {
              stripeCurrentPeriodEnd: currentPeriodEnd,
              status: "active",
            },
          });

          await db.user.updateMany({
            where: { stripeSubscriptionId: subscriptionId },
            data: {
              stripeCurrentPeriodEnd: currentPeriodEnd,
            },
          });
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = typeof invoice.subscription === "string" ? invoice.subscription : invoice.subscription?.id;

        if (subscriptionId) {
          await db.subscription.updateMany({
            where: { stripeSubscriptionId: subscriptionId },
            data: { status: "past_due" },
          });
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const subscriptionId = subscription.id;

        await db.subscription.updateMany({
          where: { stripeSubscriptionId: subscriptionId },
          data: { status: "canceled" },
        });

        await db.user.updateMany({
          where: { stripeSubscriptionId: subscriptionId },
          data: {
            stripeSubscriptionId: null,
            stripePriceId: null,
            stripeCurrentPeriodEnd: null,
          },
        });
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const subscriptionId = subscription.id;
        const priceId = subscription.items.data[0]?.price?.id || "";
        const currentPeriodEnd = new Date(subscription.current_period_end * 1000);
        const status = subscription.status === "active" ? "active" : subscription.status === "past_due" ? "past_due" : "canceled";

        await db.subscription.updateMany({
          where: { stripeSubscriptionId: subscriptionId },
          data: {
            stripePriceId: priceId,
            stripeCurrentPeriodEnd: currentPeriodEnd,
            status,
          },
        });

        await db.user.updateMany({
          where: { stripeSubscriptionId: subscriptionId },
          data: {
            stripePriceId: priceId,
            stripeCurrentPeriodEnd: currentPeriodEnd,
          },
        });
        break;
      }

      default:
        // Unhandled event type
        break;
    }
  } catch (err: any) {
    console.error("Webhook processing error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
