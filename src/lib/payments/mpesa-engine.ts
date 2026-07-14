import { db } from "@/lib/db";

const CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET;
const PASSKEY = process.env.MPESA_PASSKEY;
const SHORTCODE = process.env.MPESA_SHORTCODE;
const CALLBACK_URL = process.env.MPESA_CALLBACK_URL || "https://bohenix.africa/api/payments/mpesa/callback";
// Use sandbox by default unless in production
const BASE_URL = process.env.NODE_ENV === 'production' && process.env.MPESA_ENV === 'production' 
  ? "https://api.safaricom.co.ke" 
  : "https://sandbox.safaricom.co.ke";

export const MpesaEngine = {
  /**
   * Get an OAuth token from Safaricom
   */
  async getToken(): Promise<string> {
    if (!CONSUMER_KEY || !CONSUMER_SECRET) {
      throw new Error("M-Pesa credentials not configured. Please set MPESA_CONSUMER_KEY and MPESA_CONSUMER_SECRET.");
    }
    const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString("base64");
    const res = await fetch(`${BASE_URL}/oauth/v1/generate?grant_type=client_credentials`, {
      headers: { Authorization: `Basic ${auth}` },
    });
    
    if (!res.ok) {
      throw new Error("Failed to generate M-Pesa access token");
    }
    const data = await res.json();
    return data.access_token;
  },

  /**
   * Initiate an STK Push (Lipa Na M-Pesa Online)
   */
  async initiateStkPush(params: {
    phoneNumber: string; // Must be formatted as 2547XXXXXXXX
    amount: number;
    reference: string;
    description: string;
    userId?: string;
  }) {
    if (!PASSKEY || !SHORTCODE) {
      throw new Error("M-Pesa PASSKEY or SHORTCODE not configured");
    }

    const token = await this.getToken();
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
    const password = Buffer.from(`${SHORTCODE}${PASSKEY}${timestamp}`).toString("base64");

    const payload = {
      BusinessShortCode: SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: Math.ceil(params.amount),
      PartyA: params.phoneNumber,
      PartyB: SHORTCODE,
      PhoneNumber: params.phoneNumber,
      CallBackURL: CALLBACK_URL,
      AccountReference: params.reference.substring(0, 12),
      TransactionDesc: params.description.substring(0, 13)
    };

    const res = await fetch(`${BASE_URL}/mpesa/stkpush/v1/processrequest`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    
    if (data.ResponseCode === "0") {
      // Save pending transaction to DB
      await db.mpesaTransaction.create({
        data: {
          userId: params.userId,
          transactionType: "STK_PUSH",
          merchantReqId: data.MerchantRequestID,
          checkoutReqId: data.CheckoutRequestID,
          phoneNumber: params.phoneNumber,
          amount: params.amount,
          status: "PENDING",
        }
      });
      return { success: true, checkoutRequestId: data.CheckoutRequestID };
    } else {
      throw new Error(data.errorMessage || "STK Push failed");
    }
  },

  /**
   * Handle Safaricom Callback
   */
  async processCallback(callbackData: any) {
    const body = callbackData.Body.stkCallback;
    const checkoutReqId = body.CheckoutRequestID;
    const resultCode = body.ResultCode;
    const resultDesc = body.ResultDesc;

    if (!checkoutReqId) throw new Error("Invalid callback format");

    const transaction = await db.mpesaTransaction.findFirst({
      where: { checkoutReqId }
    });

    if (!transaction) throw new Error("Transaction not found");

    if (resultCode === 0) {
      // Success
      const items = body.CallbackMetadata.Item;
      const mpesaReceipt = items.find((item: any) => item.Name === "MpesaReceiptNumber")?.Value;
      const transactionDateStr = items.find((item: any) => item.Name === "TransactionDate")?.Value?.toString();
      const amount = items.find((item: any) => item.Name === "Amount")?.Value;

      // Parse date: 20231122153020 -> Date object
      let transactionDate = new Date();
      if (transactionDateStr && transactionDateStr.length >= 14) {
        const year = parseInt(transactionDateStr.substring(0, 4));
        const month = parseInt(transactionDateStr.substring(4, 6)) - 1;
        const day = parseInt(transactionDateStr.substring(6, 8));
        const hour = parseInt(transactionDateStr.substring(8, 10));
        const min = parseInt(transactionDateStr.substring(10, 12));
        const sec = parseInt(transactionDateStr.substring(12, 14));
        transactionDate = new Date(year, month, day, hour, min, sec);
      }

      await db.mpesaTransaction.update({
        where: { id: transaction.id },
        data: {
          status: "SUCCESS",
          mpesaReceipt,
          amount: amount ? parseFloat(amount) : transaction.amount,
          resultDesc,
          callbackData: JSON.stringify(callbackData),
          transactionDate
        }
      });

      return { success: true, mpesaReceipt, amount };
    } else {
      // Failed or cancelled
      await db.mpesaTransaction.update({
        where: { id: transaction.id },
        data: {
          status: "FAILED",
          resultDesc,
          callbackData: JSON.stringify(callbackData)
        }
      });
      return { success: false, error: resultDesc };
    }
  },

  /**
   * Query the status of an STK Push transaction
   */
  async queryStkPushStatus(checkoutReqId: string) {
    if (!PASSKEY || !SHORTCODE) {
      throw new Error("M-Pesa PASSKEY or SHORTCODE not configured");
    }

    const token = await this.getToken();
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
    const password = Buffer.from(`${SHORTCODE}${PASSKEY}${timestamp}`).toString("base64");

    const payload = {
      BusinessShortCode: SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      CheckoutRequestID: checkoutReqId
    };

    const res = await fetch(`${BASE_URL}/mpesa/stkpushquery/v1/query`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    return data;
  }
};
