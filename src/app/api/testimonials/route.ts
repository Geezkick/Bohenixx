import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    success: true,
    testimonials: [
      {
        id: "1",
        name: "Enterprise Partner",
        company: "Bohenix Network",
        role: "Chief Innovation Officer",
        quote: "Bohenix AI Workforce OS transformed our operational efficiency by automating multi-departmental workflows effortlessly.",
        rating: 5,
        createdAt: new Date().toISOString()
      }
    ]
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    return NextResponse.json({ success: true, testimonial: body });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to process testimonial" }, { status: 500 });
  }
}
