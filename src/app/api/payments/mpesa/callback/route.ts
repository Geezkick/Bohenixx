import { NextRequest, NextResponse } from "next/server";
import { MpesaEngine } from "@/lib/payments/mpesa-engine";
import { triggerWebhooks } from "@/lib/webhookEngine";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    console.log("[M-Pesa Callback] Received data:", JSON.stringify(data, null, 2));

    const result = await MpesaEngine.processCallback(data);
    
    // Find user to trigger webhooks if possible
    if (data?.Body?.stkCallback?.CheckoutRequestID) {
      const transaction = await db.mpesaTransaction.findFirst({
        where: { checkoutReqId: data.Body.stkCallback.CheckoutRequestID }
      });

      if (transaction && transaction.userId) {
        if (result.success) {
          await triggerWebhooks(transaction.userId, "mpesa.payment.success", {
            transaction_id: transaction.id,
            receipt: result.mpesaReceipt,
            amount: result.amount
          });
        } else {
          await triggerWebhooks(transaction.userId, "mpesa.payment.failed", {
            transaction_id: transaction.id,
            error: result.error
          });
        }
      }
    }

    // Always return 200 OK to Safaricom
    return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" });
  } catch (error) {
    console.error("[M-Pesa Callback] Error processing callback:", error);
    // Still return 200 OK so Safaricom doesn't retry endlessly, but log the error
    return NextResponse.json({ ResultCode: 0, ResultDesc: "Error processing but accepted" });
  }
}
