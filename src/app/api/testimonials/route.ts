import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { approved: true },
      orderBy: { createdAt: 'desc' },
      take: 20
    });
    return NextResponse.json(testimonials);
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return NextResponse.json({ error: "Failed to fetch testimonials" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, company, message, rating } = body;

    if (!name || !message) {
      return NextResponse.json({ error: "Name and message are required" }, { status: 400 });
    }

    const testimonial = await prisma.testimonial.create({
      data: {
        name,
        company,
        message,
        rating: rating || 5,
        // Auto-approving for now so it's visible immediately. 
        // In production, this should default to false and have an admin panel.
        approved: true 
      }
    });

    return NextResponse.json({ success: true, testimonial }, { status: 201 });
  } catch (error) {
    console.error("Error creating testimonial:", error);
    return NextResponse.json({ error: "Failed to post testimonial" }, { status: 500 });
  }
}
