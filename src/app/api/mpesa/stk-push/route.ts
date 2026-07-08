import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// M-Pesa Daraja API integration
// Requires MPESA_CONSUMER_KEY, MPESA_CONSUMER_SECRET, MPESA_SHORTCODE, MPESA_PASSKEY in env

async function getMpesaToken(): Promise<string | null> {
  const consumerKey = process.env.MPESA_CONSUMER_KEY;
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
  
  if (!consumerKey || !consumerSecret) return null;

  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
  const res = await fetch('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
    headers: { Authorization: `Basic ${auth}` },
  });
  const data = await res.json();
  return data.access_token || null;
}

function formatPhone(phone: string): string {
  // Convert 0712345678 -> 254712345678
  let cleaned = phone.replace(/\s+/g, '').replace(/^\+/, '');
  if (cleaned.startsWith('0')) {
    cleaned = '254' + cleaned.substring(1);
  }
  return cleaned;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { phone, amount, description } = body;

    if (!phone || !amount) {
      return NextResponse.json({ error: 'Phone and amount are required' }, { status: 400 });
    }

    const token = await getMpesaToken();

    if (!token) {
      // Simulation mode when M-Pesa keys aren't configured
      const mockId = `SIM-${Date.now()}`;
      await db.payment.create({
        data: {
          provider: 'mpesa',
          referenceId: mockId,
          status: 'PENDING',
          amount: Number(amount),
          currency: 'KES',
          customerPhone: formatPhone(phone),
          metadata: JSON.stringify({ description, simulation: true }),
        }
      });
      return NextResponse.json({
        success: true,
        message: `STK Push simulation sent to ${phone} for KES ${amount}. Configure MPESA_CONSUMER_KEY to enable live payments.`,
        checkoutRequestId: mockId,
        simulation: true,
      });
    }

    // Live Daraja STK Push
    const shortcode = process.env.MPESA_SHORTCODE || '174379';
    const passkey = process.env.MPESA_PASSKEY || '';
    const timestamp = new Date().toISOString().replace(/[-T:Z.]/g, '').substring(0, 14);
    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64');

    const callbackUrl = process.env.NEXT_PUBLIC_BASE_URL
      ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/mpesa/callback`
      : 'https://bohenix.africa/api/mpesa/callback';

    const stkRes = await fetch('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        BusinessShortCode: shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: Math.ceil(amount),
        PartyA: formatPhone(phone),
        PartyB: shortcode,
        PhoneNumber: formatPhone(phone),
        CallBackURL: callbackUrl,
        AccountReference: 'BohenixPOS',
        TransactionDesc: description || 'Medical Billing Payment',
      }),
    });

    const stkData = await stkRes.json();

    if (stkData.ResponseCode === '0') {
      await db.payment.create({
        data: {
          provider: 'mpesa',
          referenceId: stkData.CheckoutRequestID,
          status: 'PENDING',
          amount: Number(amount),
          currency: 'KES',
          customerPhone: formatPhone(phone),
          metadata: JSON.stringify({ description }),
        }
      });

      return NextResponse.json({
        success: true,
        message: `STK Push sent to ${phone}. Please check the device and enter M-Pesa PIN.`,
        checkoutRequestId: stkData.CheckoutRequestID,
      });
    } else {
      return NextResponse.json({
        success: false,
        message: stkData.errorMessage || stkData.ResponseDescription || 'STK Push failed',
      }, { status: 400 });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
