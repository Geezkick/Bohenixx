import { db } from "@/lib/db";
import { FlowAgent, FlowTask, CompanyDNA } from "@prisma/client";
import { ExecutionEngine } from "./execution-engine";
import { SimulationEngine } from "./simulation-engine";

/**
 * BOHENIX NEURAL CORE ORCHESTRATOR
 * The central intelligence engine that governs the AI Workforce.
 * 
 * CONSCIOUSNESS LOOP:
 * Observe -> Understand -> Remember -> Reason -> Plan -> Predict -> Simulate -> 
 * Evaluate Risk -> Request Approval (if required) -> Execute -> Verify -> Reflect -> Learn -> Optimize
 * 
 * NOTHING BYPASSES THIS PIPELINE.
 */

export class NeuralCoreOrchestrator {
  
  /**
   * MASTER PIPELINE
   * The single entry point for all agent operations.
   * Enforces the full consciousness loop from observation to learning.
   */
  static async processRequest(userId: string, agentId: string, prompt: string) {
    console.log(`\n========================================`);
    console.log(`[NEURAL CORE] Processing request from user ${userId}`);
    console.log(`========================================\n`);

    // === PHASE 1: OBSERVE & UNDERSTAND ===
    const { task, agent, dna } = await this.ingestRequest(userId, agentId, prompt);
    console.log(`[OBSERVE] Task ${task.id} registered for Agent ${agent.name}`);

    // === PHASE 2: REMEMBER (Context Retrieval) ===
    const context = await this.retrieveContextWindow(userId, prompt);
    console.log(`[REMEMBER] Context window built: "${context.substring(0, 60)}..."`);

    // === PHASE 3: REASON & PLAN ===
    // In production, an LLM would decompose the prompt into an action plan.
    const proposedAction = prompt; // Simplified: the prompt IS the action for now.
    console.log(`[PLAN] Proposed action: "${proposedAction.substring(0, 80)}"`);

    // === PHASE 4: SIMULATE ===
    const simulationResult = await SimulationEngine.simulate(task, agent, proposedAction, dna);
    console.log(`[SIMULATE] Risk=${simulationResult.riskLevel}, PassesPolicy=${simulationResult.passesPolicy}`);

    // === PHASE 5: EVALUATE RISK & APPROVAL ===
    if (simulationResult.requiresApproval) {
      const policyResult = await this.enforcePolicy(userId, task, simulationResult.simulation.id, simulationResult.riskLevel);
      console.log(`[POLICY] Execution BLOCKED. Awaiting human authorization.`);
      return {
        status: "PENDING_APPROVAL",
        task,
        simulation: simulationResult.simulation,
        message: policyResult.reason
      };
    }

    // === PHASE 6: EXECUTE ===
    console.log(`[EXECUTE] Authorized. Dispatching to Execution Engine...`);
    const completedTask = await this.execute(task, agent, proposedAction, "Passed simulation and policy checks.");

    // === PHASE 7: VERIFY & REPORT ===
    console.log(`[VERIFY] Task ${completedTask.id} completed with status: ${completedTask.status}`);
    console.log(`[NEURAL CORE] Pipeline complete.\n`);

    return {
      status: completedTask.status,
      task: completedTask,
      simulation: simulationResult.simulation
    };
  }

  /**
   * 1. OBSERVE & UNDERSTAND
   * Receives a request, validates the Company DNA exists, and registers the task.
   */
  static async ingestRequest(userId: string, agentId: string, prompt: string) {
    const dna = await db.companyDNA.findUnique({ where: { userId } });
    if (!dna) {
      throw new Error("Company DNA missing. Cannot proceed with unauthorized operations.");
    }

    const agent = await db.flowAgent.findUnique({ where: { id: agentId } });
    if (!agent) {
      throw new Error("Agent not found.");
    }

    // Register the task
    const task = await db.flowTask.create({
      data: {
        userId,
        agentId,
        prompt,
        status: "ANALYZING"
      }
    });

    return { task, agent, dna };
  }

  /**
   * 2. RETRIEVE CONTEXT
   * Pulls relevant context from the Knowledge Graph to build the context window.
   */
  static async retrieveContextWindow(userId: string, taskPrompt: string) {
    // Fetch knowledge nodes related to this user's company
    const nodes = await db.knowledgeNode.findMany({
      where: { userId },
      take: 10,
      orderBy: { updatedAt: "desc" }
    });

    if (nodes.length === 0) {
      return "No prior knowledge. Operating with default company parameters.";
    }

    // Build a context string from the knowledge graph
    const contextParts = nodes.map(n => `[${n.nodeType}] ${n.label}`);
    return `Active intelligence nodes: ${contextParts.join(", ")}. Company is operational.`;
  }

  /**
   * 4. EVALUATE RISK & REQUIRE APPROVAL
   * Uses the simulation result to determine if human approval is needed.
   */
  static async enforcePolicy(userId: string, task: FlowTask, simulationId: string, riskLevel: string) {
    // Pause task and request human approval
    await db.flowTask.update({
      where: { id: task.id },
      data: { status: "PENDING_APPROVAL", approvalRequired: true }
    });

    await db.approvalRequest.create({
      data: {
        taskId: task.id,
        userId: userId,
        agentId: task.agentId,
        action: `${riskLevel} Risk Action Detected by Neural Core Simulation Engine`,
        riskLevel,
        status: "PENDING"
      }
    });

    return { approved: false, reason: `${riskLevel} risk detected. Requires human CEO authorization.` };
  }

  /**
   * 5. EXECUTE & VERIFY
   * Hands off the authorized execution to the Execution Engine.
   */
  static async execute(task: FlowTask, agent: FlowAgent, actionTaken: string, reasoning: string) {
    // Mark as executing
    await db.flowTask.update({
      where: { id: task.id },
      data: { status: "RUNNING" }
    });

    // Generate execution plan based on the action and agent type
    const planSteps = this.generateExecutionPlan(agent, actionTaken);

    // Hand off to the execution engine which handles Tool Routing and Learning
    return await ExecutionEngine.executeAuthorizedPlan(task, agent, planSteps);
  }

  /**
   * Generates an execution plan based on agent type and action context.
   */
  private static generateExecutionPlan(agent: FlowAgent, action: string): { action: string, tool: string, params: any }[] {
    const lowerAction = action.toLowerCase();

    // Executive agents orchestrate workflows
    if (agent.type === "executive") {
      return [
        { action: "Orchestrate Workflow", tool: "workflow_orchestrator", params: { depth: 2 } },
        { action: "Generate Executive Summary", tool: "financial_dashboard_access", params: {} }
      ];
    }

    // Finance agents handle money
    if (agent.type === "finance") {
      const steps: { action: string, tool: string, params: any }[] = [];
      if (lowerAction.includes("payment") || lowerAction.includes("mpesa") || lowerAction.includes("transfer")) {
        steps.push({ action: "Process Payment", tool: "mpesa_api_access", params: {} });
      }
      if (lowerAction.includes("invoice") || lowerAction.includes("reconcil")) {
        steps.push({ action: "Reconcile Payments", tool: "reconciliation_engine", params: {} });
      }
      if (lowerAction.includes("parse") || lowerAction.includes("scan")) {
        steps.push({ action: "Parse Invoice", tool: "invoice_parser", params: {} });
      }
      if (steps.length === 0) {
        steps.push({ action: "Financial Analysis", tool: "reconciliation_engine", params: {} });
      }
      return steps;
    }

    // Sales agents handle CRM
    if (agent.type === "sales") {
      return [
        { action: "Access CRM", tool: "crm_access", params: {} },
        { action: "Execute Outreach", tool: "email_outreach_tool", params: {} }
      ];
    }

    // Support agents handle tickets
    if (agent.type === "support") {
      return [
        { action: "Search Knowledge Base", tool: "knowledge_base_search", params: {} },
        { action: "Update Ticket", tool: "ticketing_system_access", params: {} }
      ];
    }

    // Legal agents handle compliance
    if (agent.type === "legal") {
      return [
        { action: "Analyze Contract", tool: "contract_analyzer", params: {} },
        { action: "Check Compliance", tool: "compliance_checker", params: {} }
      ];
    }

    // Default fallback
    return [
      { action: "Execute Task", tool: "workflow_orchestrator", params: {} }
    ];
  }
}
