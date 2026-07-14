import { db } from "@/lib/db";

export interface MemoryEntry {
  category: "customer" | "project" | "preference" | "fact" | "decision" | "conversation";
  key: string;
  value: string;
  importance?: number;
}

export const MemoryStore = {
  /**
   * Save a new memory or update an existing one for an agent.
   */
  async saveMemory(agentId: string, entry: MemoryEntry) {
    const existing = await db.agentMemory.findFirst({
      where: { agentId, category: entry.category, key: entry.key }
    });

    if (existing) {
      return db.agentMemory.update({
        where: { id: existing.id },
        data: { 
          value: entry.value,
          importance: entry.importance !== undefined ? entry.importance : existing.importance
        }
      });
    }

    return db.agentMemory.create({
      data: {
        agentId,
        category: entry.category,
        key: entry.key,
        value: entry.value,
        importance: entry.importance || 0.5
      }
    });
  },

  /**
   * Retrieve memories for an agent, optionally filtered by category.
   */
  async getMemories(agentId: string, options?: { category?: string; minImportance?: number; limit?: number }) {
    return db.agentMemory.findMany({
      where: {
        agentId,
        ...(options?.category ? { category: options.category } : {}),
        ...(options?.minImportance !== undefined ? { importance: { gte: options.minImportance } } : {})
      },
      orderBy: { importance: 'desc' },
      take: options?.limit || 50
    });
  },

  /**
   * Delete a specific memory
   */
  async deleteMemory(memoryId: string) {
    return db.agentMemory.delete({ where: { id: memoryId } });
  },

  /**
   * Get formatted context string of all relevant memories for a prompt
   */
  async getContextString(agentId: string): Promise<string> {
    const memories = await this.getMemories(agentId, { minImportance: 0.3 });
    if (memories.length === 0) return "";

    let context = "--- AGENT MEMORY ---\nHere are facts and preferences you remember:\n";
    
    const byCategory = memories.reduce((acc, mem) => {
      if (!acc[mem.category]) acc[mem.category] = [];
      acc[mem.category].push(mem);
      return acc;
    }, {} as Record<string, typeof memories>);

    for (const [category, items] of Object.entries(byCategory)) {
      context += `\n[${category.toUpperCase()}]\n`;
      items.forEach(item => {
        context += `- ${item.key}: ${item.value}\n`;
      });
    }
    
    context += "--------------------\n";
    return context;
  }
};
