import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/db";
import { seedUserKnowledge } from "@/lib/knowledge-writer";

/**
 * GET /api/neural-core/graph
 * Returns the Knowledge Graph nodes and edges for the authenticated user.
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let nodes = await db.knowledgeNode.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" }
    });

    // Auto-seed if empty
    if (nodes.length === 0) {
      await seedUserKnowledge(userId);

      // Re-fetch after seeding
      nodes = await db.knowledgeNode.findMany({
        where: { userId },
        orderBy: { createdAt: "asc" }
      });
    }

    const edges = await db.knowledgeEdge.findMany({
      where: { userId }
    });

    // Fetch Company DNA for context
    const dna = await db.companyDNA.findUnique({ where: { userId } });

    return NextResponse.json({
      success: true,
      nodes,
      edges,
      dna,
      stats: {
        totalNodes: nodes.length,
        totalEdges: edges.length,
        nodeTypes: [...new Set(nodes.map(n => n.nodeType))]
      }
    });
  } catch (error) {
    console.error("Error fetching knowledge graph:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

/**
 * POST /api/neural-core/graph
 * Allows manual seeding or creating custom knowledge nodes/edges.
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const action = body.action || "seed";

    if (action === "seed") {
      await seedUserKnowledge(userId);
    } else if (action === "createNode" && body.label && body.nodeType) {
      await db.knowledgeNode.create({
        data: {
          userId,
          nodeType: body.nodeType,
          label: body.label,
          properties: body.properties ? JSON.stringify(body.properties) : null
        }
      });
    }

    const nodes = await db.knowledgeNode.findMany({ where: { userId } });
    const edges = await db.knowledgeEdge.findMany({ where: { userId } });

    return NextResponse.json({
      success: true,
      nodes,
      edges,
      stats: {
        totalNodes: nodes.length,
        totalEdges: edges.length,
        nodeTypes: [...new Set(nodes.map(n => n.nodeType))]
      }
    });
  } catch (error) {
    console.error("Error updating knowledge graph:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
