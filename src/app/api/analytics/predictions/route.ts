import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { ForecastingEngine } from "@/lib/predictions/forecasting-engine";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = (session.user as any).id;

    const [cashFlowForecast, anomalies] = await Promise.all([
      ForecastingEngine.forecastCashFlow(userId),
      ForecastingEngine.detectAnomalies(userId)
    ]);

    return NextResponse.json({
      success: true,
      data: {
        cashFlowForecast,
        anomalies
      }
    });
  } catch (error: any) {
    console.error("Failed to fetch predictions:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
