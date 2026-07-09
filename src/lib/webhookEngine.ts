import { db } from "@/lib/db";
import crypto from "crypto";

type WebhookPayload = {
  event: string;
  created_at: string;
  [key: string]: any;
};

export async function triggerWebhooks(userId: string, event: string, data: Record<string, any>) {
  try {
    const webhooks = await db.webhook.findMany({
      where: { userId, isActive: true },
    });

    if (webhooks.length === 0) return;

    const payload: WebhookPayload = {
      event,
      created_at: new Date().toISOString(),
      ...data,
    };

    const payloadString = JSON.stringify(payload);

    // Fire and forget, but update status asynchronously
    Promise.allSettled(
      webhooks.map(async (webhook) => {
        // In a real production system with high load, this would be pushed to a queue (like SQS or Redis BullMQ).
        // For now, we do it in-memory.
        const signature = crypto
          .createHmac("sha256", webhook.secret)
          .update(payloadString)
          .digest("hex");

        let success = false;
        try {
          // Use standard fetch with an abort controller for timeout (5 seconds)
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 5000);
          
          const response = await fetch(webhook.url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Bohenix-Signature": signature,
              "User-Agent": "Bohenix-FlowAI-Webhook/1.0",
            },
            body: payloadString,
            signal: controller.signal,
          });
          
          clearTimeout(timeout);
          success = response.ok;
        } catch (err) {
          console.error(`Webhook delivery failed for ${webhook.url}:`, err);
        }

        // Update the webhook status in the database
        await db.webhook.update({
          where: { id: webhook.id },
          data: {
            lastStatus: success ? "success" : "failed",
            lastSentAt: new Date(),
          },
        });
      })
    );
  } catch (error) {
    console.error("Failed to process webhooks:", error);
  }
}
