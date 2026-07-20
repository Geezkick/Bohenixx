import { db } from "@/lib/db";
import { FlowAgent, FlowTask, CompanyDNA } from "@prisma/client";

/**
 * BOHENIX SIMULATION ENGINE
 * Runs predictive analysis before any agent executes an action.
 * Evaluates: Success Probability, Financial Impact, Risk Score, Business Impact.
 * The Neural Core will never execute without consulting this engine first.
 */

// Keyword-based risk signals for heuristic evaluation
const HIGH_RISK_KEYWORDS = ["transfer", "delete", "terminate", "payment", "wire", "send money", "fire", "remove", "cancel contract"];
const MEDIUM_RISK_KEYWORDS = ["update", "modify", "change", "edit", "override", "adjust budget"];
const FINANCIAL_KEYWORDS = ["mpesa", "payment", "invoice", "transfer", "salary", "payroll", "refund", "billing"];

export class SimulationEngine {

  /**
   * Run a full simulation of a proposed action against Company DNA constraints.
   * Returns a SimulationRecord stored in the database.
   */
  static async simulate(
    task: FlowTask,
    agent: FlowAgent,
    proposedAction: string,
    dna: CompanyDNA
  ) {
    console.log(`[SIMULATION ENGINE] Simulating action for Agent ${agent.name}: "${proposedAction.substring(0, 80)}..."`);

    // 1. Calculate Risk Score (0-1) via keyword heuristics
    const riskScore = this.calculateRiskScore(proposedAction);

    // 2. Estimate Financial Impact
    const financialImpactKes = this.estimateFinancialImpact(proposedAction, dna);

    // 3. Calculate Success Probability
    const successProbability = this.calculateSuccessProbability(agent, riskScore);

    // 4. Predict Outcome
    const predictedOutcome = this.generatePrediction(proposedAction, riskScore, successProbability, financialImpactKes);

    // 5. Determine if this simulation passes the Company DNA's risk appetite
    const passesPolicy = this.evaluateAgainstDNA(riskScore, dna);

    // 6. Store the Simulation Record
    const simulation = await db.simulationRecord.create({
      data: {
        taskId: task.id,
        agentId: agent.id,
        proposedAction,
        successProbability,
        financialImpactKes,
        riskScore,
        predictedOutcome,
        status: passesPolicy ? "PENDING_EXECUTION" : "REJECTED"
      }
    });

    console.log(`[SIMULATION ENGINE] Result: Risk=${riskScore.toFixed(2)}, Success=${(successProbability * 100).toFixed(0)}%, Financial=KSh ${financialImpactKes.toLocaleString()}, Policy=${passesPolicy ? "PASS" : "BLOCKED"}`);

    return {
      simulation,
      passesPolicy,
      riskLevel: this.getRiskLevel(riskScore),
      requiresApproval: !passesPolicy
    };
  }

  /**
   * Heuristic risk score based on action keywords.
   */
  private static calculateRiskScore(action: string): number {
    const lowerAction = action.toLowerCase();
    let score = 0.1; // Base risk

    for (const keyword of HIGH_RISK_KEYWORDS) {
      if (lowerAction.includes(keyword)) {
        score += 0.25;
      }
    }

    for (const keyword of MEDIUM_RISK_KEYWORDS) {
      if (lowerAction.includes(keyword)) {
        score += 0.1;
      }
    }

    return Math.min(score, 1.0);
  }

  /**
   * Estimates financial impact based on detected monetary context.
   */
  private static estimateFinancialImpact(action: string, dna: CompanyDNA): number {
    const lowerAction = action.toLowerCase();
    const isFinancial = FINANCIAL_KEYWORDS.some(k => lowerAction.includes(k));

    if (!isFinancial) return 0;

    // Extract numbers from the action string as a rough estimate
    const numbers = action.match(/\d[\d,]*/g);
    if (numbers && numbers.length > 0) {
      const largest = Math.max(...numbers.map(n => parseFloat(n.replace(/,/g, ''))));
      return largest;
    }

    // Default to 10% of the budget limit if we can't extract a number
    return (dna.budgetLimitsKes || 100000) * 0.1;
  }

  /**
   * Success probability based on agent experience and action risk.
   */
  private static calculateSuccessProbability(agent: FlowAgent, riskScore: number): number {
    // More experienced agents (higher tasksCompleted) have higher success rates
    const experienceBonus = Math.min(agent.tasksCompleted * 0.01, 0.15);
    const baseProbability = 0.85;
    
    // Higher risk = lower success probability
    const riskPenalty = riskScore * 0.3;

    return Math.max(0.1, Math.min(1.0, baseProbability + experienceBonus - riskPenalty));
  }

  /**
   * Generate a human-readable prediction for the Executive Dashboard.
   */
  private static generatePrediction(
    action: string,
    riskScore: number,
    successProbability: number,
    financialImpact: number
  ): string {
    const riskLevel = this.getRiskLevel(riskScore);
    const successPct = (successProbability * 100).toFixed(0);

    if (riskLevel === "CRITICAL") {
      return `CRITICAL RISK: This action has a ${successPct}% estimated success rate with significant exposure of KSh ${financialImpact.toLocaleString()}. Human CEO approval is mandatory before execution. Recommend reviewing alternatives.`;
    }
    if (riskLevel === "HIGH") {
      return `HIGH RISK: Action carries elevated risk (${riskScore.toFixed(2)}). Financial exposure: KSh ${financialImpact.toLocaleString()}. Executive approval recommended. Success probability: ${successPct}%.`;
    }
    if (riskLevel === "MEDIUM") {
      return `MODERATE RISK: Standard operating procedure with manageable risk. Financial exposure: KSh ${financialImpact.toLocaleString()}. Success probability: ${successPct}%. Auto-execution recommended.`;
    }
    return `LOW RISK: Routine action with ${successPct}% success probability. Minimal financial exposure. Safe for autonomous execution.`;
  }

  /**
   * Evaluate simulation against Company DNA risk appetite.
   */
  private static evaluateAgainstDNA(riskScore: number, dna: CompanyDNA): boolean {
    const appetite = dna.riskAppetite;

    // CONSERVATIVE: Only auto-approve LOW risk
    if (appetite === "CONSERVATIVE") return riskScore <= 0.2;
    // MODERATE: Auto-approve LOW and MEDIUM risk
    if (appetite === "MODERATE") return riskScore <= 0.4;
    // AGGRESSIVE: Auto-approve up to HIGH risk
    return riskScore <= 0.7;
  }

  /**
   * Convert numeric risk score to human-readable level.
   */
  static getRiskLevel(riskScore: number): string {
    if (riskScore > 0.7) return "CRITICAL";
    if (riskScore > 0.4) return "HIGH";
    if (riskScore > 0.2) return "MEDIUM";
    return "LOW";
  }
}
