import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get config
    let config = await db.widgetConfig.findUnique({ where: { userId } });
    if (!config) {
      config = await db.widgetConfig.create({
        data: { userId }
      });
    }

    // Get testimonials
    const testimonials = await db.testimonial.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ config, testimonials });
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
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
    
    // Simulate someone submitting a testimonial for this user
    const testimonial = await db.testimonial.create({
      data: {
        userId,
        name: body.name || "Anonymous",
        company: body.company || "",
        message: body.message,
        rating: body.rating || 5,
        approved: false
      }
    });

    return NextResponse.json({ testimonial });
  } catch (error) {
    console.error("Error creating testimonial:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
