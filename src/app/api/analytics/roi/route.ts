import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { RoiCalculator } from "@/lib/analytics/roi-calculator";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = (session.user as any).id;

    // Fetch all ROI data points concurrently
    const [platformRoi, agentPerformance, timeSeries] = await Promise.all([
      RoiCalculator.getPlatformRoi(userId),
      RoiCalculator.getAgentPerformance(userId),
      RoiCalculator.getRoiTimeSeries(userId)
    ]);

    return NextResponse.json({
      success: true,
      data: {
        platformRoi,
        agentPerformance,
        timeSeries
      }
    });
  } catch (error: any) {
    console.error("Failed to fetch ROI analytics:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
