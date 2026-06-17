import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { service, budget, timeline, details, email } = body;

    // Save to DB
    const newRequest = await db.serviceRequest.create({
      data: {
        service,
        budget,
        timeline,
        details,
        email,
      }
    });

    // We can also log this into the activity feed
    await db.activityLog.create({
      data: {
        app: "Bohenix ONE",
        action: `New service request received for ${service}`,
        color: "#00C853",
      }
    });

    return NextResponse.json({ success: true, request: newRequest });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
