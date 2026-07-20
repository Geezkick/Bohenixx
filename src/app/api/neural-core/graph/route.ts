import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/db";

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

    const nodes = await db.knowledgeNode.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" }
    });

    const edges = await db.knowledgeEdge.findMany({
      where: { userId }
    });

    // Also fetch Company DNA for the status panel
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
