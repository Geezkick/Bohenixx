import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const subscription = await db.subscription.findUnique({
    where: { userId },
  });

  if (!subscription) {
    return NextResponse.json({
      active: false,
      plan: null,
      status: null,
      currentPeriodEnd: null,
    });
  }

  // Determine plan name from price ID
  let plan = "Starter";
  if (subscription.stripePriceId) {
    // This will work with the metadata we store
    plan = "Active Plan";
  }

  return NextResponse.json({
    active: subscription.status === "active",
    plan,
    status: subscription.status,
    currentPeriodEnd: subscription.stripeCurrentPeriodEnd,
    subscriptionId: subscription.stripeSubscriptionId,
  });
}
