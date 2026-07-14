import { db } from "@/lib/db";

const HUMAN_HOURLY_RATE_KES = 1500; // ~ $10-12/hr for mid-level knowledge worker in Kenya
const AVG_MINUTES_PER_TASK = 15; // Assumption: A typical business task (invoice, support email, scheduling) takes 15 mins manually
const AI_COST_PER_TASK_KES = 1; // Assumption: API cost per task is negligible (e.g., 1 KES)

export const RoiCalculator = {
  /**
   * Calculate global platform ROI metrics for a specific user
   */
  async getPlatformRoi(userId: string) {
    // Get all completed tasks for this user
    const completedTasks = await db.flowTask.count({
      where: {
        userId,
        status: "COMPLETED"
      }
    });

    const failedTasks = await db.flowTask.count({
      where: {
        userId,
        status: "FAILED"
      }
    });

    const totalTasks = completedTasks + failedTasks;
    const automationRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    const totalMinutesSaved = completedTasks * AVG_MINUTES_PER_TASK;
    const totalHoursSaved = totalMinutesSaved / 60;

    const humanCostEquivalent = totalHoursSaved * HUMAN_HOURLY_RATE_KES;
    const aiCost = completedTasks * AI_COST_PER_TASK_KES;
    const netSavingsKes = humanCostEquivalent - aiCost;

    return {
      completedTasks,
      totalHoursSaved,
      netSavingsKes,
      automationRate,
      humanHourlyRate: HUMAN_HOURLY_RATE_KES
    };
  },

  /**
   * Breakdown performance by agent
   */
  async getAgentPerformance(userId: string) {
    const agents = await db.flowAgent.findMany({
      where: { userId },
      include: {
        tasks: {
          select: { status: true }
        }
      }
    });

    return agents.map(agent => {
      const completed = agent.tasks.filter(t => t.status === "COMPLETED").length;
      const failed = agent.tasks.filter(t => t.status === "FAILED").length;
      const total = completed + failed;
      const successRate = total > 0 ? (completed / total) * 100 : 0;
      
      const hoursSaved = (completed * AVG_MINUTES_PER_TASK) / 60;
      const savingsKes = (hoursSaved * HUMAN_HOURLY_RATE_KES) - (completed * AI_COST_PER_TASK_KES);

      return {
        agentId: agent.id,
        name: agent.name,
        department: agent.department || "General",
        tasksCompleted: completed,
        successRate,
        savingsKes
      };
    }).sort((a, b) => b.savingsKes - a.savingsKes);
  },

  /**
   * Generate time-series data for ROI over the last 30 days
   */
  async getRoiTimeSeries(userId: string) {
    // For a real implementation, we would group by DATE(completedAt).
    // Prisma doesn't have a simple Date grouping function across all databases,
    // so we fetch the tasks and group them in memory.
    
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const tasks = await db.flowTask.findMany({
      where: {
        userId,
        status: "COMPLETED",
        completedAt: {
          gte: thirtyDaysAgo
        }
      },
      select: {
        completedAt: true
      }
    });

    const dailyData: Record<string, { tasks: number, savings: number }> = {};
    
    // Initialize last 30 days with 0
    for(let i=29; i>=0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      dailyData[dateStr] = { tasks: 0, savings: 0 };
    }

    // Populate actual data
    tasks.forEach(task => {
      if (task.completedAt) {
        const dateStr = task.completedAt.toISOString().split('T')[0];
        if (dailyData[dateStr]) {
          dailyData[dateStr].tasks += 1;
          const hoursSaved = AVG_MINUTES_PER_TASK / 60;
          const saving = (hoursSaved * HUMAN_HOURLY_RATE_KES) - AI_COST_PER_TASK_KES;
          dailyData[dateStr].savings += saving;
        }
      }
    });

    return Object.keys(dailyData).map(date => ({
      date,
      tasks: dailyData[date].tasks,
      savings: dailyData[date].savings
    }));
  }
};
