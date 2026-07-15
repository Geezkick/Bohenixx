import React from "react";
import styles from "../dashboard.module.css";
import { Network, Database, Key, BookOpen } from "lucide-react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function KnowledgePage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;
  if (!userId) redirect("/sign-in");

  // Fetch all AgentMemory connected to the user's agents
  const memories = await db.agentMemory.findMany({
    where: { agent: { userId } },
    orderBy: { createdAt: "desc" },
    include: { agent: { select: { name: true } } }
  });

  return (
    <>
      <div className={styles.missionHeader}>
        <div>
          <h1 className={styles.pageTitle}>Knowledge Graph</h1>
          <p className={styles.pageDesc}>Persistent memory and learned context across all autonomous agents.</p>
        </div>
        <div className={styles.systemClock} style={{ flexDirection: 'row', alignItems: 'center', gap: '1rem' }}>
          <div>
            <div className={styles.clockLabel}>TOTAL NODES</div>
            <div className={styles.clockValue} style={{ fontSize: '1.2rem' }}>{memories.length}</div>
          </div>
          <Network size={24} color="rgba(255,255,255,0.2)" />
        </div>
      </div>

      <div style={{ marginTop: "2rem" }}>
        {memories.length === 0 ? (
          <div style={{ color: "rgba(255,255,255,0.4)", padding: "2rem", textAlign: "center", border: "1px dashed rgba(255,255,255,0.1)", borderRadius: "16px" }}>
            <Database size={48} style={{ opacity: 0.2, marginBottom: "1rem" }} />
            <div>Knowledge graph is currently empty. Agents will automatically save facts here as they work.</div>
          </div>
        ) : (
          <div className={styles.osGrid} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }}>
            {memories.map(memory => (
              <div key={memory.id} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "12px", padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem", transition: "all 0.2s" }} className={styles.agentCardOS}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#A78BFA", fontSize: "0.75rem", fontWeight: 700 }}>
                    <Key size={12} /> {memory.key.toUpperCase()}
                  </div>
                  <span style={{ fontSize: "0.65rem", background: "rgba(255,255,255,0.1)", padding: "2px 6px", borderRadius: "4px", color: "rgba(255,255,255,0.6)" }}>
                    {memory.category}
                  </span>
                </div>
                
                <div style={{ fontSize: "0.9rem", color: "#fff", lineHeight: 1.5, flex: 1 }}>
                  {memory.value}
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "0.75rem", marginTop: "0.5rem" }}>
                  <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", display: "flex", alignItems: "center", gap: "4px" }}>
                    <BookOpen size={12} /> Learned by {memory.agent.name}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)" }}>
                    {new Date(memory.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
