import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { db } from '@/lib/db';
import { sendEmail } from '@/lib/email';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const invoices = await db.invoice.findMany({
      where: { userId },
      include: { client: true },
      orderBy: { createdAt: 'desc' }
    });

    const clients = await db.client.findMany({
      where: { userId }
    });

    return NextResponse.json({ invoices, clients });
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return NextResponse.json({ error: "Failed to fetch invoices" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { clientName, clientEmail, amount, dueDate, notes } = body;

    if (!clientName || !clientEmail || !amount || !dueDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Upsert the client
    let client = await db.client.findFirst({
      where: { userId, email: clientEmail }
    });

    if (!client) {
      client = await db.client.create({
        data: {
          userId,
          name: clientName,
          email: clientEmail
        }
      });
    }

    // Create the invoice
    const invoiceNumber = `INV-${Date.now().toString(36).toUpperCase()}`;
    const invoice = await db.invoice.create({
      data: {
        userId,
        clientId: client.id,
        invoiceNumber,
        amount: parseFloat(amount),
        dueDate: new Date(dueDate),
        notes: notes || "",
        status: "SENT"
      },
      include: { client: true }
    });

    // Dispatch automated email to client
    await sendEmail({
      to: client.email,
      subject: `Invoice ${invoiceNumber} from Bohenix`,
      text: `Hello ${client.name},\n\nYou have a new invoice (${invoiceNumber}) for $${amount}.\nDue date: ${new Date(dueDate).toDateString()}.\n\nThank you for your business!`,
      type: 'INVOICE'
    });

    return NextResponse.json({ success: true, invoice }, { status: 201 });
  } catch (error) {
    console.error("Error creating invoice:", error);
    return NextResponse.json({ error: "Failed to create invoice" }, { status: 500 });
  }
}
