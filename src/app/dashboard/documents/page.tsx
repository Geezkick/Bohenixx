import React from "react";
import styles from "../dashboard.module.css";
import { Upload, FileText, CheckCircle2, ShieldAlert } from "lucide-react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function DocumentsPage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;
  if (!userId) redirect("/sign-in");

  const documents = await db.documentScan.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { agent: true }
  });

  return (
    <>
      <div className={styles.missionHeader}>
        <div>
          <h1 className={styles.pageTitle}>Documents & OCR</h1>
          <p className={styles.pageDesc}>Invoices, receipts, and contracts processed by the AI workforce.</p>
        </div>
        <button className={styles.actionBtn} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Upload size={16} /> Upload Document
        </button>
      </div>

      <div style={{ marginTop: "2rem" }}>
        {documents.length === 0 ? (
          <div style={{ color: "rgba(255,255,255,0.4)", padding: "2rem", textAlign: "center", border: "1px dashed rgba(255,255,255,0.1)", borderRadius: "16px" }}>
            <FileText size={48} style={{ opacity: 0.2, marginBottom: "1rem" }} />
            <div>No documents processed yet.</div>
          </div>
        ) : (
          <div className={styles.osGrid} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "1.5rem" }}>
            {documents.map(doc => (
              <div key={doc.id} className={styles.agentCardOS} style={{ cursor: "default" }}>
                <div className={styles.agentCardTop}>
                  <div className={styles.agentAvatar} style={{ borderColor: "rgba(255,255,255,0.2)" }}>
                    <FileText size={20} color="rgba(255,255,255,0.8)" />
                  </div>
                  <div className={styles.agentInfo}>
                    <div className={styles.agentName}>{doc.documentType.toUpperCase()}</div>
                    <div className={styles.agentRole}>Uploaded {new Date(doc.createdAt).toLocaleDateString()}</div>
                  </div>
                  {doc.confidenceScore && doc.confidenceScore > 0.8 ? (
                    <div className={styles.agentStatusBadge} style={{ color: "#22c55e", backgroundColor: "#22c55e15" }}>
                      <CheckCircle2 size={12} /> High Confidence
                    </div>
                  ) : (
                    <div className={styles.agentStatusBadge} style={{ color: "#F59E0B", backgroundColor: "#F59E0B15" }}>
                      <ShieldAlert size={12} /> Review Needed
                    </div>
                  )}
                </div>
                
                <div className={styles.agentCardBody} style={{ fontFamily: "monospace", fontSize: "0.75rem", background: "rgba(0,0,0,0.5)" }}>
                  <div className={styles.agentTaskLabel}>EXTRACTED DATA (JSON)</div>
                  <pre style={{ margin: 0, overflowX: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "rgba(255,255,255,0.6)" }}>
                    {doc.extractedData ? doc.extractedData.substring(0, 80) + "..." : "No data extracted."}
                  </pre>
                </div>

                <div className={styles.agentCardFooter}>
                  <div className={styles.agentMetric}>
                    <span className={styles.metricLabel}>PROCESSED BY</span>
                    <span className={styles.metricValue}>{doc.agent?.name || "System OCR"}</span>
                  </div>
                  <div className={styles.agentMetric}>
                    <span className={styles.metricLabel}>FILE</span>
                    <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" style={{ color: "#A78BFA", fontSize: "0.85rem", fontWeight: 600, textDecoration: "none" }}>
                      View Original
                    </a>
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
