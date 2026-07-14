import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { MpesaEngine } from "@/lib/payments/mpesa-engine";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { phoneNumber, amount, reference, description } = body;

    if (!phoneNumber || !amount || !reference || !description) {
      return NextResponse.json(
        { error: "Missing required fields: phoneNumber, amount, reference, description" },
        { status: 400 }
      );
    }

    // Format phone number to 2547XXXXXXXX
    let formattedPhone = phoneNumber.replace(/[^0-9]/g, "");
    if (formattedPhone.startsWith("0")) {
      formattedPhone = "254" + formattedPhone.substring(1);
    } else if (formattedPhone.startsWith("+")) {
      formattedPhone = formattedPhone.substring(1);
    }

    if (!formattedPhone.startsWith("254") || formattedPhone.length !== 12) {
      return NextResponse.json({ error: "Invalid phone number format. Must be a valid Kenyan number." }, { status: 400 });
    }

    const result = await MpesaEngine.initiateStkPush({
      phoneNumber: formattedPhone,
      amount: parseFloat(amount),
      reference,
      description,
      userId: (session.user as any).id,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("STK Push error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to initiate STK Push" },
      { status: 500 }
    );
  }
}
