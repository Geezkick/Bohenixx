import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-04-10" as any,
});

const PLANS: Record<string, { usd: number; kes: number; name: string; interval: "month" | "year" }> = {
  Starter: { usd: 1900, kes: 245000, name: "Flow AI Starter Plan", interval: "month" },
  "Free Trial": { usd: 1900, kes: 245000, name: "Flow AI Starter Plan", interval: "month" },
  Professional: { usd: 4900, kes: 635000, name: "Flow AI Professional Plan", interval: "month" },
  Enterprise: { usd: 19900, kes: 1500000, name: "Flow AI Enterprise Plan", interval: "month" },
};

export async function POST(req: NextRequest) {
  try {
    const { plan, currency = "usd" } = await req.json();

    const planConfig = PLANS[plan] || PLANS["Starter"];
    const priceAmount = currency === "kes" ? planConfig.kes : planConfig.usd;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: planConfig.name,
              description: "Autonomous AI Workforce deployment — recurring subscription",
            },
            unit_amount: priceAmount,
            recurring: {
              interval: planConfig.interval,
            },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.NEXTAUTH_URL}/dashboard/flow-ai?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/flow-ai`,
      metadata: {
        plan: plan,
      },
    });

    return NextResponse.json({ success: true, url: session.url });
  } catch (error: any) {
    console.error("Stripe Checkout Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
