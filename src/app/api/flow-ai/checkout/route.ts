import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-04-10" as any,
});

export async function POST(req: NextRequest) {
  try {
    const { plan, currency = "usd" } = await req.json();

    let priceAmount = 0;
    let productName = "Flow AI Subscription";

    // Set mock pricing based on the plan
    if (plan === "Starter" || plan === "Free Trial") {
      priceAmount = currency === "kes" ? 245000 : 1900; // In cents/smallest unit
      productName = "Flow AI Starter Plan";
    } else if (plan === "Professional") {
      priceAmount = currency === "kes" ? 635000 : 4900;
      productName = "Flow AI Professional Plan";
    } else if (plan === "Enterprise") {
      priceAmount = currency === "kes" ? 1500000 : 19900;
      productName = "Flow AI Enterprise Plan";
    } else {
      priceAmount = currency === "kes" ? 245000 : 1900;
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: productName,
              description: "Autonomous AI Workforce deployment",
            },
            unit_amount: priceAmount,
          },
          quantity: 1,
        },
      ],
      mode: "payment", // Using 'payment' for a simple one-off transaction test
      success_url: `${process.env.NEXTAUTH_URL}/dashboard/flow-ai?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/flow-ai`,
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
