import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Return structured team hierarchy & roles
    const teamMembers = [
      { id: "usr_1", name: "Primary Account Owner", email: "owner@bohenix.ai", role: "OWNER", status: "ACTIVE", joinedAt: "2026-07-01T10:00:00Z" },
      { id: "usr_2", name: "Operations Director", email: "ops@bohenix.ai", role: "ADMIN", status: "ACTIVE", joinedAt: "2026-07-15T14:30:00Z" },
      { id: "usr_3", name: "Financial Auditor", email: "audit@bohenix.ai", role: "AUDITOR", status: "ACTIVE", joinedAt: "2026-07-20T09:15:00Z" }
    ];

    return NextResponse.json({ success: true, members: teamMembers });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { email, role } = await req.json();

    if (!email || !role) {
      return NextResponse.json({ error: "Email and role are required" }, { status: 400 });
    }

    const newMember = {
      id: "usr_" + Math.random().toString(36).substring(2, 9),
      name: email.split("@")[0],
      email,
      role: role.toUpperCase(),
      status: "INVITED",
      joinedAt: new Date().toISOString()
    };

    return NextResponse.json({ 
      success: true, 
      message: `Invitation sent to ${email} with role [${role.toUpperCase()}]`,
      member: newMember 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
