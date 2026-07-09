import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import Stripe from "stripe";
import { db } from "@/lib/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16" as any,
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Since we didn't save the Stripe Customer ID on the user model directly in our basic schema,
    // we would look it up from a Payment record. 
    // For production, you'd save stripeCustomerId directly on the User model.
    const payment = await db.payment.findFirst({
      where: { customerEmail: session?.user?.email },
      orderBy: { createdAt: "desc" }
    });

    if (!payment) {
      return NextResponse.json({ error: "No active billing found." }, { status: 404 });
    }

    // Since we don't have the explicit customerId saved in the payment metadata (just the checkout reference),
    // let's fetch the checkout session from stripe to get the customer id
    const checkoutSession = await stripe.checkout.sessions.retrieve(payment.referenceId);
    
    if (!checkoutSession.customer) {
      return NextResponse.json({ error: "Customer not found in Stripe." }, { status: 404 });
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: checkoutSession.customer as string,
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/subscriptions`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (error) {
    console.error("Stripe Portal Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
