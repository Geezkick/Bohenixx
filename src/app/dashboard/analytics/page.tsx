import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import { RoiCalculator } from "@/lib/analytics/roi-calculator";
import { ForecastingEngine } from "@/lib/predictions/forecasting-engine";
import AnalyticsClientWrapper from "./AnalyticsClientWrapper";

export const metadata = {
  title: "Executive Analytics - Bohenix Flow AI",
  description: "ROI and Predictive Analytics",
};

export default async function AnalyticsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    redirect("/sign-in");
  }

  const userId = (session.user as any).id;

  // Fetch all data server-side for initial render speed
  const [platformRoi, agentPerformance, timeSeries, cashFlowForecast, anomalies] = await Promise.all([
    RoiCalculator.getPlatformRoi(userId),
    RoiCalculator.getAgentPerformance(userId),
    RoiCalculator.getRoiTimeSeries(userId),
    ForecastingEngine.forecastCashFlow(userId),
    ForecastingEngine.detectAnomalies(userId)
  ]);

  return (
    <div className="flex-1 w-full bg-[#05030A] text-white min-h-screen">
      <AnalyticsClientWrapper 
        platformRoi={platformRoi}
        agentPerformance={agentPerformance}
        timeSeries={timeSeries}
        cashFlowForecast={cashFlowForecast}
        anomalies={anomalies}
      />
    </div>
  );
}
