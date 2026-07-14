import { db } from "@/lib/db";

export const ForecastingEngine = {
  /**
   * Forecast cash flow for the next 7 days based on recent invoices and historical completion rate
   */
  async forecastCashFlow(userId: string) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Get historical invoice payment rate (how many invoices get paid within 7 days)
    const recentInvoices = await db.invoice.findMany({
      where: {
        userId,
        createdAt: { gte: thirtyDaysAgo }
      }
    });

    // In a real AI model, this would be a time-series forecast (ARIMA/Prophet)
    // For this heuristic implementation, we use a simple average daily revenue multiplier
    let totalRevenue = 0;
    const paidInvoices = recentInvoices.filter(i => i.status === "PAID");
    
    paidInvoices.forEach(i => {
      totalRevenue += i.amountKes;
    });

    const averageDailyRevenue = totalRevenue / 30;
    
    // Project next 7 days
    const forecast = [];
    for(let i = 1; i <= 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      
      // Add some variance for realism (±15%)
      const variance = (Math.random() * 0.3) - 0.15; 
      const projectedRevenue = averageDailyRevenue * (1 + variance);
      
      forecast.push({
        date: d.toISOString().split('T')[0],
        projectedRevenueKes: Math.max(0, Math.round(projectedRevenue))
      });
    }

    return forecast;
  },

  /**
   * Detect anomalies in the agent workflow (e.g., sudden spike in failed tasks)
   */
  async detectAnomalies(userId: string) {
    const anomalies = [];
    
    // 1. Task Failure Anomaly
    const last24Hours = new Date();
    last24Hours.setHours(last24Hours.getHours() - 24);
    
    const previous24Hours = new Date(last24Hours);
    previous24Hours.setHours(previous24Hours.getHours() - 24);

    const recentFailed = await db.flowTask.count({
      where: {
        userId,
        status: "FAILED",
        createdAt: { gte: last24Hours }
      }
    });

    const previousFailed = await db.flowTask.count({
      where: {
        userId,
        status: "FAILED",
        createdAt: { gte: previous24Hours, lt: last24Hours }
      }
    });

    // If failures more than tripled and there are at least 3 failures
    if (recentFailed >= 3 && recentFailed > (previousFailed * 3)) {
      anomalies.push({
        type: "HIGH_FAILURE_RATE",
        severity: "HIGH",
        message: `Task failure rate spiked. ${recentFailed} failures in the last 24h compared to ${previousFailed} the day before.`,
        suggestedAction: "Check agent system prompts and API keys."
      });
    }

    // 2. M-Pesa Reversal Anomaly (Mock implementation)
    const recentReversals = await db.mpesaTransaction.count({
      where: {
        userId,
        status: "FAILED",
        createdAt: { gte: last24Hours }
      }
    });

    if (recentReversals >= 5) {
      anomalies.push({
        type: "PAYMENT_FAILURES",
        severity: "MEDIUM",
        message: `Detected ${recentReversals} M-Pesa payment failures in the last 24h.`,
        suggestedAction: "Verify Safaricom Daraja API balances and STK push numbers."
      });
    }

    if (anomalies.length === 0) {
      anomalies.push({
        type: "SYSTEM_HEALTHY",
        severity: "LOW",
        message: "No anomalies detected. System operating within normal parameters.",
        suggestedAction: "None"
      });
    }

    return anomalies;
  }
};
