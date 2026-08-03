import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/db";
import { logActivity } from "@/lib/activityLogger";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let dna = await db.companyDNA.findUnique({
      where: { userId }
    });

    if (!dna) {
      // Default initial DNA if not present
      dna = await db.companyDNA.create({
        data: {
          userId,
          mission: "To operate efficiently, scale autonomously, and maximize ROI.",
          vision: "A fully autonomous enterprise.",
          operatingRules: JSON.stringify([
            "Always optimize for capital efficiency.",
            "Require human approval for high-risk actions.",
            "Maintain complete audit logs for financial transactions."
          ]),
          riskAppetite: "MODERATE",
          budgetLimitsKes: 100000
        }
      });
    }

    let parsedRules = [];
    try {
      parsedRules = dna.operatingRules ? JSON.parse(dna.operatingRules) : [];
    } catch {
      parsedRules = [dna.operatingRules];
    }

    const knowledgeNodes = await db.knowledgeNode.findMany({
      where: { userId },
      take: 10,
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({
      success: true,
      dna: {
        ...dna,
        operatingRules: parsedRules
      },
      knowledgeNodes
    });
  } catch (error: any) {
    console.error("Error fetching Company DNA:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch DNA" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { mission, vision, operatingRules, riskAppetite, budgetLimitsKes } = body;

    const updatedDna = await db.companyDNA.upsert({
      where: { userId },
      update: {
        ...(mission !== undefined && { mission }),
        ...(vision !== undefined && { vision }),
        ...(operatingRules !== undefined && {
          operatingRules: Array.isArray(operatingRules) ? JSON.stringify(operatingRules) : operatingRules
        }),
        ...(riskAppetite !== undefined && { riskAppetite }),
        ...(budgetLimitsKes !== undefined && { budgetLimitsKes: parseFloat(budgetLimitsKes) })
      },
      create: {
        userId,
        mission: mission || "To operate efficiently, scale autonomously, and maximize ROI.",
        vision: vision || "A fully autonomous enterprise.",
        operatingRules: JSON.stringify(
          operatingRules || [
            "Always optimize for capital efficiency.",
            "Require human approval for high-risk actions.",
            "Maintain complete audit logs for financial transactions."
          ]
        ),
        riskAppetite: riskAppetite || "MODERATE",
        budgetLimitsKes: budgetLimitsKes ? parseFloat(budgetLimitsKes) : 100000
      }
    });

    await logActivity({
      userId,
      app: "Neural Core",
      action: `Updated Company DNA posture (Risk: ${updatedDna.riskAppetite})`,
      color: "#7B2DFF"
    });

    let parsedRules = [];
    try {
      parsedRules = updatedDna.operatingRules ? JSON.parse(updatedDna.operatingRules) : [];
    } catch {
      parsedRules = [updatedDna.operatingRules];
    }

    return NextResponse.json({
      success: true,
      dna: {
        ...updatedDna,
        operatingRules: parsedRules
      }
    });
  } catch (error: any) {
    console.error("Error updating Company DNA:", error);
    return NextResponse.json({ error: error.message || "Failed to update DNA" }, { status: 500 });
  }
}
