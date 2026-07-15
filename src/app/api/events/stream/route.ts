import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const stream = new ReadableStream({
    async start(controller) {
      let lastCheck = new Date();

      const encoder = new TextEncoder();
      
      const sendEvent = (data: any) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      // Send initial connection success message
      sendEvent({ type: "connected", timestamp: lastCheck.toISOString() });

      // Poll database for new events periodically
      const interval = setInterval(async () => {
        try {
          const newActivities = await db.activityLog.findMany({
            where: {
              userId,
              createdAt: { gt: lastCheck }
            },
            orderBy: { createdAt: 'asc' }
          });

          const newApprovals = await db.approvalRequest.findMany({
            where: {
              userId,
              status: "PENDING",
              createdAt: { gt: lastCheck }
            },
            include: {
              task: { include: { agent: true } }
            },
            orderBy: { createdAt: 'asc' }
          });

          lastCheck = new Date(); // Update last check time

          if (newActivities.length > 0) {
            sendEvent({ type: "activities", payload: newActivities });
          }

          if (newApprovals.length > 0) {
            sendEvent({
              type: "approvals",
              payload: newApprovals.map(req => ({
                id: req.id,
                agentName: req.task.agent.name,
                action: req.action,
                amountKes: req.amountKes,
                createdAt: req.createdAt
              }))
            });
          }

          // Send a heartbeat to keep connection alive
          sendEvent({ type: "heartbeat", timestamp: lastCheck.toISOString() });
        } catch (error) {
          console.error("SSE Polling Error:", error);
          controller.enqueue(encoder.encode(`event: error\ndata: ${JSON.stringify({ message: "Internal Server Error" })}\n\n`));
        }
      }, 5000); // 5 seconds interval

      // Handle client disconnect
      request.signal.addEventListener("abort", () => {
        clearInterval(interval);
        controller.close();
      });
    }
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
    },
  });
}
