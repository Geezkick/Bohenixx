"use client";

import React, { useEffect, useState } from "react";
import styles from "../dashboard.module.css";
import { Upload, FileText, CheckCircle2, ShieldAlert, X, Loader2, FileCheck } from "lucide-react";

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/documents/upload");
      const data = await res.json();
      if (data.success) {
        setDocuments(data.documents || []);
      }
    } catch (err) {
      console.error("Failed to load documents:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    try {
      setUploading(true);
      setUploadError(null);
      const formData = new FormData();
      formData.append("file", selectedFile);

      const res = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to process document");
      }

      setIsModalOpen(false);
      setSelectedFile(null);
      fetchDocuments();
    } catch (err: any) {
      setUploadError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <div className={styles.missionHeader}>
        <div>
          <h1 className={styles.pageTitle}>Documents & OCR</h1>
          <p className={styles.pageDesc}>Invoices, receipts, and contracts processed by the AI workforce.</p>
        </div>
        <button 
          className={styles.actionBtn} 
          onClick={() => setIsModalOpen(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Upload size={16} /> Upload Document
        </button>
      </div>

      <div style={{ marginTop: "2rem" }}>
        {loading ? (
          <div style={{ color: "rgba(255,255,255,0.4)", padding: "2rem" }}>Loading documents...</div>
        ) : documents.length === 0 ? (
          <div style={{ color: "rgba(255,255,255,0.4)", padding: "2rem", textAlign: "center", border: "1px dashed rgba(255,255,255,0.1)", borderRadius: "16px" }}>
            <FileText size={48} style={{ opacity: 0.2, marginBottom: "1rem" }} />
            <div>No documents processed yet. Click 'Upload Document' to scan a file.</div>
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
                    <div className={styles.agentName}>{(doc.documentType || "DOCUMENT").toUpperCase()}</div>
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

      {/* Upload Document Modal */}
      {isModalOpen && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 1000, padding: "1rem"
        }}>
          <div style={{
            background: "#0c0a18", border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "20px", padding: "2rem", width: "100%", maxWidth: "480px",
            boxShadow: "0 24px 64px rgba(0,0,0,0.8)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <FileCheck size={24} color="#7B2DFF" />
                <h2 style={{ margin: 0, fontSize: "1.25rem", color: "#fff", fontWeight: 600 }}>Scan & Extract Document</h2>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)} 
                style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer" }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div style={{
                border: "2px dashed rgba(255,255,255,0.15)", borderRadius: "14px",
                padding: "2rem", textAlign: "center", background: "rgba(255,255,255,0.02)",
                cursor: "pointer", position: "relative"
              }}>
                <input 
                  type="file" 
                  accept="image/*,application/pdf,text/*"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", opacity: 0, cursor: "pointer" }}
                  required
                />
                <Upload size={32} color="#A78BFA" style={{ marginBottom: "0.75rem", opacity: 0.8 }} />
                {selectedFile ? (
                  <div style={{ color: "#22c55e", fontWeight: 600, fontSize: "0.9rem" }}>
                    Selected: {selectedFile.name}
                  </div>
                ) : (
                  <div>
                    <div style={{ color: "#fff", fontWeight: 500, fontSize: "0.95rem" }}>Click or drag file to upload</div>
                    <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8rem", marginTop: "4px" }}>
                      Supports PNG, JPG, PDF, TXT (Invoices, Receipts, Contracts)
                    </div>
                  </div>
                )}
              </div>

              {uploadError && (
                <div style={{ color: "#EF4444", fontSize: "0.85rem", background: "rgba(239, 68, 68, 0.1)", padding: "0.75rem", borderRadius: "8px" }}>
                  {uploadError}
                </div>
              )}

              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "0.5rem" }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    padding: "0.75rem 1.25rem", borderRadius: "10px",
                    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                    color: "#fff", cursor: "pointer", fontSize: "0.85rem"
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading || !selectedFile}
                  style={{
                    padding: "0.75rem 1.5rem", borderRadius: "10px",
                    background: "#7B2DFF", border: "none", color: "#fff",
                    cursor: uploading ? "wait" : "pointer", fontSize: "0.85rem",
                    fontWeight: 600, display: "flex", alignItems: "center", gap: "8px"
                  }}
                >
                  {uploading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Extracting Data...
                    </>
                  ) : (
                    "Upload & Process"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
