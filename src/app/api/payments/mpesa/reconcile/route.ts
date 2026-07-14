import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { ReconciliationEngine } from "@/lib/payments/reconciliation-engine";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { transactionId, invoiceId } = body;

    // If both transactionId and invoiceId are provided, do manual reconciliation
    if (transactionId && invoiceId) {
      const result = await ReconciliationEngine.reconcileTransaction(transactionId, invoiceId, (session.user as any).id);
      return NextResponse.json(result);
    }

    // Otherwise, auto-reconcile all
    const result = await ReconciliationEngine.autoReconcileAll((session.user as any).id);
    return NextResponse.json(result);

  } catch (error: any) {
    console.error("Reconciliation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to reconcile payments" },
      { status: 500 }
    );
  }
}
