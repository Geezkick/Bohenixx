import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// M-Pesa callback endpoint
// Safaricom sends payment confirmation here after STK push completion

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Log the callback for debugging
    console.log('[M-Pesa Callback]', JSON.stringify(body, null, 2));

    const resultCode = body?.Body?.stkCallback?.ResultCode;
    const checkoutRequestId = body?.Body?.stkCallback?.CheckoutRequestID;

    if (checkoutRequestId) {
      if (resultCode === 0) {
        // Payment successful
        console.log(`[M-Pesa] Payment confirmed for ${checkoutRequestId}`);
        await db.payment.updateMany({
          where: { referenceId: checkoutRequestId },
          data: { status: 'SUCCESS' },
        });
      } else {
        console.log(`[M-Pesa] Payment failed/cancelled for ${checkoutRequestId}: Code ${resultCode}`);
        await db.payment.updateMany({
          where: { referenceId: checkoutRequestId },
          data: { status: 'FAILED' },
        });
      }
    }

    // Safaricom expects a success response
    return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' });
  } catch (err: any) {
    console.error('[M-Pesa Callback Error]', err.message);
    return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' });
  }
}
