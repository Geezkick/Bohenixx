import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { MpesaEngine } from "@/lib/payments/mpesa-engine";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { checkoutRequestId } = body;

    if (!checkoutRequestId) {
      return NextResponse.json(
        { error: "Missing required field: checkoutRequestId" },
        { status: 400 }
      );
    }

    // 1. Fetch from DB first to see if we already have a final status
    const transaction = await db.mpesaTransaction.findFirst({
      where: { checkoutReqId: checkoutRequestId, userId: (session.user as any).id }
    });

    if (!transaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    // If it's already successful or failed in our DB, we don't strictly need to query Daraja,
    // but we will do it anyway to be thorough if requested, or we can just return DB state.
    // For this endpoint, let's query Daraja to get real-time status if it's still PENDING.
    
    if (transaction.status !== "PENDING") {
      return NextResponse.json({
        status: transaction.status,
        mpesaReceipt: transaction.mpesaReceipt,
        resultDesc: transaction.resultDesc,
        fromDb: true
      });
    }

    // 2. Query Safaricom Daraja API
    const result = await MpesaEngine.queryStkPushStatus(checkoutRequestId);

    // Safaricom ResponseCodes: 
    // "0" means the query was successful, BUT ResultCode inside determines the actual transaction status.
    if (result.ResponseCode === "0") {
      const resultCode = result.ResultCode;
      const resultDesc = result.ResultDesc;

      let newStatus = "PENDING";
      if (resultCode === "0") {
        newStatus = "SUCCESS";
      } else if (resultCode) {
        newStatus = "FAILED";
      }

      if (newStatus !== "PENDING") {
        // Update our DB since we missed the callback or it hasn't arrived
        await db.mpesaTransaction.update({
          where: { id: transaction.id },
          data: {
            status: newStatus,
            resultDesc: resultDesc
          }
        });
      }

      return NextResponse.json({
        status: newStatus,
        resultCode,
        resultDesc,
        raw: result
      });
    } else {
      return NextResponse.json({
        status: "PENDING",
        error: result.errorMessage || "Could not fetch status from Daraja"
      });
    }

  } catch (error: any) {
    console.error("STK Push Status query error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to query status" },
      { status: 500 }
    );
  }
}
