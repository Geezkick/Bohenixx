import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      // Send initial connection event
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify({ type: 'connected', timestamp: new Date().toISOString() })}\n\n`)
      );

      // Interval pushing live mock/system events
      const interval = setInterval(() => {
        const sampleEvents = [
          { app: "Bohenix Neural Core", action: "Knowledge node linked: [Invoice #INV-902] ↔ [M-Pesa STK]", color: "#7B2DFF" },
          { app: "Finance Specialist Agent", action: "Reconciled payment of KES 12,500 via Daraja API", color: "#22c55e" },
          { app: "Security & 2FA Engine", action: "Verified active session token clearance", color: "#00F0FF" },
          { app: "Risk Engine", action: "Simulated task outcome — Risk Score 0.04 (Passed)", color: "#eab308" }
        ];

        const randomEvent = sampleEvents[Math.floor(Math.random() * sampleEvents.length)];
        const eventData = {
          id: Math.random().toString(36).substring(2, 9),
          ...randomEvent,
          createdAt: new Date().toISOString()
        };

        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(eventData)}\n\n`));
        } catch {
          clearInterval(interval);
        }
      }, 5000);

      // Clean up on cancel
      return () => {
        clearInterval(interval);
      };
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
    },
  });
}
