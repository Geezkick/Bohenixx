/**
 * knowledge-writer.ts
 * Automatically extracts entities from completed agent tasks and writes
 * them to the KnowledgeNode / KnowledgeEdge tables so the graph
 * self-populates as agents work.
 */

import { db } from "@/lib/db";

type NodeType =
  | "AGENT"
  | "CUSTOMER"
  | "INVOICE"
  | "DOCUMENT"
  | "CONCEPT"
  | "DEPARTMENT"
  | "TASK";

interface ExtractedNode {
  nodeType: NodeType;
  label: string;
  properties?: Record<string, unknown>;
}

// ─── Simple entity extractor ──────────────────────────────────────────────────
// Looks for patterns in text to pull out names, invoices, concepts etc.
// This runs client-side (server action) so we keep it light / regex-based.
function extractEntities(
  prompt: string,
  result: string,
  agentType: string
): ExtractedNode[] {
  const nodes: ExtractedNode[] = [];
  const text = `${prompt} ${result}`;

  // Invoice numbers  →  INV-xxx / #xxx
  const invoiceMatches = text.match(
    /\b(?:INV|invoice)[- #]?(\d{3,8})\b/gi
  );
  if (invoiceMatches) {
    for (const m of invoiceMatches.slice(0, 3)) {
      nodes.push({
        nodeType: "INVOICE",
        label: m.replace(/\s+/g, "").toUpperCase(),
        properties: { source: "agent_task" },
      });
    }
  }

  // Email addresses  → customers
  const emailMatches = text.match(
    /\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/g
  );
  if (emailMatches) {
    for (const email of emailMatches.slice(0, 3)) {
      nodes.push({
        nodeType: "CUSTOMER",
        label: email,
        properties: { source: "agent_task" },
      });
    }
  }

  // Proper-noun company-like names (Title Case 2+ words)
  const companyMatches = text.match(/\b([A-Z][a-z]+ (?:Inc|Ltd|LLC|Corp|Co|Technologies|Solutions|Group|Africa|Agency|Ventures)\b)/g);
  if (companyMatches) {
    for (const name of companyMatches.slice(0, 2)) {
      nodes.push({
        nodeType: "CUSTOMER",
        label: name.trim(),
        properties: { source: "agent_task" },
      });
    }
  }

  // Key concepts from prompt (first 8 meaningful words, de-duped)
  const stopWords = new Set([
    "the","a","an","and","or","but","in","on","at","to","for","of",
    "with","by","from","is","are","was","were","be","been","being",
    "have","has","had","do","does","did","will","would","could","should",
    "may","might","can","this","that","these","those","i","you","we","they",
    "it","its","my","your","our","their","me","him","her","us","them",
    "create","make","generate","write","draft","build","help","need","want","please",
  ]);
  const words = prompt
    .replace(/[^a-zA-Z\s]/g, " ")
    .split(/\s+/)
    .map((w) => w.toLowerCase())
    .filter((w) => w.length > 4 && !stopWords.has(w));
  const uniqueWords = [...new Set(words)].slice(0, 2);
  for (const word of uniqueWords) {
    nodes.push({
      nodeType: "CONCEPT",
      label: word.charAt(0).toUpperCase() + word.slice(1),
      properties: { source: "agent_task", agentType },
    });
  }

  // Deduplicate by label
  const seen = new Set<string>();
  return nodes.filter((n) => {
    if (seen.has(n.label)) return false;
    seen.add(n.label);
    return true;
  });
}

// ─── Main writer function ──────────────────────────────────────────────────────
export async function writeTaskKnowledge(params: {
  userId: string;
  agentId: string;
  agentName: string;
  agentType: string;
  taskId: string;
  prompt: string;
  result: string;
}) {
  try {
    const { userId, agentId, agentName, agentType, prompt, result } = params;

    // 1. Ensure the Agent itself is a node
    const agentNode = await upsertNode(userId, {
      nodeType: "AGENT",
      label: agentName,
      properties: { agentId, agentType },
    });

    // 2. Create a TASK node
    const taskNode = await upsertNode(userId, {
      nodeType: "TASK",
      label: prompt.substring(0, 60) + (prompt.length > 60 ? "…" : ""),
      properties: { taskId: params.taskId, agentId },
    });

    // 3. Edge: AGENT → TASK
    await upsertEdge(userId, agentNode.id, taskNode.id, "EXECUTED");

    // 4. Extract entities from the task
    const entities = extractEntities(prompt, result, agentType);

    for (const entity of entities) {
      const entityNode = await upsertNode(userId, entity);
      // Edge: TASK → entity
      await upsertEdge(userId, taskNode.id, entityNode.id, "RELATES_TO");
      // Edge: AGENT → entity  (shortcut for visual richness)
      await upsertEdge(userId, agentNode.id, entityNode.id, "RELATES_TO");
    }
  } catch (err) {
    // Non-critical – don't let knowledge writing crash the task
    console.error("[KnowledgeWriter] Error writing knowledge:", err);
  }
}

// ─── Seed initial nodes from existing user data ───────────────────────────────
export async function seedUserKnowledge(userId: string) {
  try {
    let agentNodesCount = 0;
    // 1. Seed any deployed agents
    const agents = await db.flowAgent.findMany({ where: { userId } });
    for (const agent of agents) {
      await upsertNode(userId, {
        nodeType: "AGENT",
        label: agent.name,
        properties: { agentId: agent.id, agentType: agent.type },
      });
      agentNodesCount++;
    }

    // 2. If user has company DNA or default setup, seed department & concept nodes
    const dna = await db.companyDNA.findUnique({ where: { userId } });
    
    // Seed core organizational nodes
    const deptFinance = await upsertNode(userId, { nodeType: "DEPARTMENT", label: "Finance & Treasury", properties: { category: "Operations" } });
    const deptOps = await upsertNode(userId, { nodeType: "DEPARTMENT", label: "Operations & Sales", properties: { category: "Growth" } });
    const deptTech = await upsertNode(userId, { nodeType: "DEPARTMENT", label: "Engineering & AI", properties: { category: "Core" } });

    // Seed default concepts / rules
    const conceptRule = await upsertNode(userId, { 
      nodeType: "CONCEPT", 
      label: dna?.riskAppetite ? `Risk: ${dna.riskAppetite}` : "Autonomous Policy Engine",
      properties: { source: "CompanyDNA" }
    });

    const conceptBudget = await upsertNode(userId, {
      nodeType: "CONCEPT",
      label: dna?.budgetLimitsKes ? `Budget Limit KES ${dna.budgetLimitsKes.toLocaleString()}` : "KES 100,000 Authority",
      properties: { source: "CompanyDNA" }
    });

    // Link concepts to departments
    await upsertEdge(userId, deptFinance.id, conceptBudget.id, "GOVERNS");
    await upsertEdge(userId, deptTech.id, conceptRule.id, "ENFORCES");

    // Connect existing user agents or seed default representative nodes
    if (agents.length > 0) {
      for (const agent of agents) {
        const agentNode = await db.knowledgeNode.findFirst({ where: { userId, label: agent.name, nodeType: "AGENT" } });
        if (agentNode) {
          const targetDept = agent.type === "finance" ? deptFinance : agent.type === "sales" ? deptOps : deptTech;
          await upsertEdge(userId, targetDept.id, agentNode.id, "BELONGS_TO");
        }
      }
    } else {
      // Seed initial starter specialist nodes if user hasn't created agents yet
      const agentFin = await upsertNode(userId, { nodeType: "AGENT", label: "FinQA Agent", properties: { role: "Finance Assistant" } });
      const agentSales = await upsertNode(userId, { nodeType: "AGENT", label: "SalesBot", properties: { role: "Sales Specialist" } });
      const agentDev = await upsertNode(userId, { nodeType: "AGENT", label: "CodeReviewer", properties: { role: "Dev Assistant" } });

      await upsertEdge(userId, deptFinance.id, agentFin.id, "BELONGS_TO");
      await upsertEdge(userId, deptOps.id, agentSales.id, "BELONGS_TO");
      await upsertEdge(userId, deptTech.id, agentDev.id, "BELONGS_TO");
      await upsertEdge(userId, agentFin.id, conceptBudget.id, "MONITORS");
      await upsertEdge(userId, agentDev.id, conceptRule.id, "COMPLIES_WITH");
    }

    return { seeded: agentNodesCount || 5 };
  } catch (err) {
    console.error("[KnowledgeWriter] Seed error:", err);
    return { seeded: 0 };
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
async function upsertNode(userId: string, node: ExtractedNode) {
  // Try to find existing node with same label and type for this user
  const existing = await db.knowledgeNode.findFirst({
    where: { userId, label: node.label, nodeType: node.nodeType },
  });
  if (existing) return existing;

  return db.knowledgeNode.create({
    data: {
      userId,
      nodeType: node.nodeType,
      label: node.label,
      properties: node.properties ? JSON.stringify(node.properties) : null,
    },
  });
}

async function upsertEdge(
  userId: string,
  sourceNodeId: string,
  targetNodeId: string,
  relationType: string
) {
  try {
    // @@unique([sourceNodeId, targetNodeId, relationType]) handles duplicates
    await db.knowledgeEdge.upsert({
      where: {
        sourceNodeId_targetNodeId_relationType: {
          sourceNodeId,
          targetNodeId,
          relationType,
        },
      },
      create: { userId, sourceNodeId, targetNodeId, relationType, weight: 1.0 },
      update: { weight: { increment: 0.1 } }, // strengthen existing edges
    });
  } catch {
    // Ignore constraint violations silently
  }
}
