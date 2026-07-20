import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/db";
import { logActivity } from "@/lib/activityLogger";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, type, companyType } = await req.json();

    if (!name || !type || !companyType) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    // 1. Determine Agent Profile based on type
    let description = "";
    let systemPrompt = "";
    let tools: { toolName: string; config?: string }[] = [];
    let initialMemory = { category: "", key: "", value: "" };
    let workflow = { name: "", trigger: "", steps: "[]" };

    if (companyType === "new" && type === "executive") {
      description = "Chief Executive Officer. Responsible for overall strategy, growth, and orchestrating the AI workforce.";
      systemPrompt = "You are the Executive CEO of a newly established enterprise. Your primary objective is to define corporate strategy, oversee all operational aspects, and determine which AI specialists need to be hired next to scale the company.";
      tools = [
        { toolName: "workflow_orchestrator", config: JSON.stringify({ max_depth: 3 }) },
        { toolName: "financial_dashboard_access" },
        { toolName: "company_directory_access" }
      ];
      initialMemory = {
        category: "decision",
        key: "company_foundation_directive",
        value: "Company established today. Priority is identifying key operational metrics and establishing the initial departmental structure."
      };
      workflow = {
        name: "CEO Daily Briefing",
        trigger: "schedule:daily",
        steps: JSON.stringify([
          { order: 1, action: "analyze_system_health", params: {} },
          { order: 2, action: "generate_executive_summary", params: {} }
        ])
      };
    } else {
      // Existing company gap
      description = `Specialized agent for ${type} operations, deployed to reinforce existing business infrastructure.`;
      systemPrompt = `You are the Lead AI Agent for the ${type} department. You have been deployed into an existing organization to optimize and automate core workflows within your domain.`;
      
      if (type === "finance") {
        tools = [{ toolName: "mpesa_api_access" }, { toolName: "invoice_parser" }, { toolName: "reconciliation_engine" }];
        initialMemory = { category: "project", key: "department_gap_filled", value: "Deployed to optimize financial reconciliation and automated billing." };
        workflow = { name: "Automated Reconciliation", trigger: "event:payment_received", steps: JSON.stringify([{ order: 1, action: "match_invoice_to_payment", params: {} }]) };
      } else if (type === "sales") {
        tools = [{ toolName: "crm_access" }, { toolName: "email_outreach_tool" }];
        initialMemory = { category: "project", key: "department_gap_filled", value: "Deployed to accelerate lead qualification and CRM hygiene." };
        workflow = { name: "Lead Qualification", trigger: "event:new_lead_captured", steps: JSON.stringify([{ order: 1, action: "score_lead", params: {} }]) };
      } else if (type === "support") {
        tools = [{ toolName: "knowledge_base_search" }, { toolName: "ticketing_system_access" }];
        initialMemory = { category: "project", key: "department_gap_filled", value: "Deployed to reduce ticket resolution time and handle frontline queries." };
        workflow = { name: "Ticket Triage", trigger: "event:new_ticket_created", steps: JSON.stringify([{ order: 1, action: "categorize_and_auto_reply", params: {} }]) };
      } else if (type === "legal") {
        tools = [{ toolName: "contract_analyzer" }, { toolName: "compliance_checker" }];
        initialMemory = { category: "project", key: "department_gap_filled", value: "Deployed to ensure rapid contract review and risk mitigation." };
        workflow = { name: "Contract Review", trigger: "event:document_uploaded", steps: JSON.stringify([{ order: 1, action: "scan_for_liabilities", params: {} }]) };
      }
    }

    // 2. Execute a Prisma Transaction to provision everything at once
    const result = await db.$transaction(async (prisma) => {
      // Create Agent
      const agent = await prisma.flowAgent.create({
        data: {
          userId,
          name,
          type,
          description,
          systemPrompt,
          status: "ACTIVE",
          department: type === "executive" ? "Executive" : type.charAt(0).toUpperCase() + type.slice(1)
        }
      });

      // Equip Tools
      if (tools.length > 0) {
        await prisma.agentTool.createMany({
          data: tools.map(t => ({
            agentId: agent.id,
            toolName: t.toolName,
            config: t.config || null
          }))
        });
      }

      // Inject Memory
      if (initialMemory.key) {
        await prisma.agentMemory.create({
          data: {
            agentId: agent.id,
            category: initialMemory.category,
            key: initialMemory.key,
            value: initialMemory.value,
            importance: 1.0
          }
        });
      }

      // Phase 2: Onboarding Override (Neural Core Initialization)
      if (companyType === "new") {
        // 1. Initialize Company DNA
        // Upsert so if a user already has one, we don't crash, but typically this is their first.
        await prisma.companyDNA.upsert({
          where: { userId },
          update: {}, // Don't override if it already exists
          create: {
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

        // 2. Seed Initial Knowledge Graph Node
        const execNode = await prisma.knowledgeNode.create({
          data: {
            userId,
            nodeType: "DEPARTMENT",
            label: "Executive Office",
            properties: JSON.stringify({ establishedAt: new Date().toISOString() })
          }
        });

        const agentNode = await prisma.knowledgeNode.create({
          data: {
            userId,
            nodeType: "AGENT",
            label: `Agent: ${agent.name}`,
            properties: JSON.stringify({ role: agent.type })
          }
        });

        // 3. Connect them via Knowledge Edge
        await prisma.knowledgeEdge.create({
          data: {
            userId,
            sourceNodeId: agentNode.id,
            targetNodeId: execNode.id,
            relationType: "BELONGS_TO",
            weight: 1.0
          }
        });
      }

      // Setup Workflow
      if (workflow.name) {
        const wfDef = await prisma.workflowDefinition.create({
          data: {
            userId,
            name: workflow.name,
            description: `Auto-provisioned workflow for ${agent.name}`,
            trigger: workflow.trigger,
            steps: workflow.steps,
            isActive: true
          }
        });

        // We can optionally link a workflowStep to the agent here, 
        // but since WorkflowDefinition is generic, it's sufficient to establish the def.
        // We'll create a dummy WorkflowStep linked to the new Workflow model if we want tight integration.
        const wf = await prisma.workflow.create({
          data: {
            userId,
            name: workflow.name,
            status: "DRAFT"
          }
        });

        await prisma.workflowStep.create({
          data: {
            workflowId: wf.id,
            agentId: agent.id,
            stepOrder: 1,
            prompt: `Execute initial protocol for ${workflow.name}`,
            status: "PENDING"
          }
        });
      }

      return agent;
    });

    await logActivity({
      userId,
      app: "Flow AI",
      action: `Provisioned systematic AI department. Lead: ${name} (${type.toUpperCase()})`,
      color: type === "executive" ? "#7B2DFF" : "#00E5FF",
    });

    return NextResponse.json({ success: true, agent: result });
  } catch (error) {
    console.error("Error provisioning flow agent ecosystem:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
