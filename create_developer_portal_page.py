import os

path = "src/app/dashboard/developer/page.tsx"

content = '''"use client";

import React, { useEffect, useState, useCallback } from "react";
import styles from "../dashboard.module.css";
import {
  Key,
  Webhook as WebhookIcon,
  BookOpen,
  Copy,
  RefreshCcw,
  Plus,
  Trash2,
  Send,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  X,
} from "lucide-react";

type ApiKeyItem = {
  id: string;
  name: string;
  keyPrefix: string;
  lastUsedAt: string | null;
  createdAt: string;
};

type WebhookItem = {
  id: string;
  url: string;
  description: string | null;
  secret: string;
  isActive: boolean;
  lastStatus: string | null;
  lastSentAt: string | null;
  createdAt: string;
};

type Toast = { id: number; message: string; kind: "success" | "error" };

export default function DeveloperPortalPage() {
  const [keys, setKeys] = useState<ApiKeyItem[]>([]);
  const [webhooks, setWebhooks] = useState<WebhookItem[]>([]);
  const [loadingKeys, setLoadingKeys] = useState(true);
  const [loadingWebhooks, setLoadingWebhooks] = useState(true);

  const [newKeyName, setNewKeyName] = useState("");
  const [creatingKey, setCreatingKey] = useState(false);
  const [revealedKey, setRevealedKey] = useState<string | null>(null);

  const [newWebhookUrl, setNewWebhookUrl] = useState("");
  const [newWebhookDesc, setNewWebhookDesc] = useState("");
  const [creatingWebhook, setCreatingWebhook] = useState(false);
  const [testingId, setTestingId] = useState<string | null>(null);

  const [toasts, setToasts] = useState<Toast[]>([]);
  const [confirmRevokeId, setConfirmRevokeId] = useState<string | null>(null);
  const [confirmDeleteWebhookId, setConfirmDeleteWebhookId] = useState<string | null>(null);

  const pushToast = useCallback((message: string, kind: "success" | "error" = "success") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, kind }]);
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 3500);
  }, []);

  const loadKeys = useCallback(async () => {
    setLoadingKeys(true);
    try {
      const res = await fetch("/api/developer/keys");
      const data = await res.json();
      if (res.ok) setKeys(data.keys || []);
    } catch {
      pushToast("Failed to load API keys", "error");
    } finally {
      setLoadingKeys(false);
    }
  }, [pushToast]);

  const loadWebhooks = useCallback(async () => {
    setLoadingWebhooks(true);
    try {
      const res = await fetch("/api/developer/webhooks");
      const data = await res.json();
      if (res.ok) setWebhooks(data.webhooks || []);
    } catch {
      pushToast("Failed to load webhooks", "error");
    } finally {
      setLoadingWebhooks(false);
    }
  }, [pushToast]);

  useEffect(() => {
    loadKeys();
    loadWebhooks();
  }, [loadKeys, loadWebhooks]);

  const handleCreateKey = async () => {
    setCreatingKey(true);
    try {
      const res = await fetch("/api/developer/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newKeyName || "Unnamed Key" }),
      });
      const data = await res.json();
      if (!res.ok) {
        pushToast(data.error || "Failed to create key", "error");
        return;
      }
      setRevealedKey(data.rawKey);
      setNewKeyName("");
      await loadKeys();
      pushToast("API key created", "success");
    } catch {
      pushToast("Failed to create key", "error");
    } finally {
      setCreatingKey(false);
    }
  };

  const handleRevokeKey = async (id: string) => {
    try {
      const res = await fetch(`/api/developer/keys?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        pushToast(data.error || "Failed to revoke key", "error");
        return;
      }
      setKeys((k) => k.filter((key) => key.id !== id));
      pushToast("API key revoked", "success");
    } catch {
      pushToast("Failed to revoke key", "error");
    } finally {
      setConfirmRevokeId(null);
    }
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    pushToast(`${label} copied to clipboard`, "success");
  };

  const handleCreateWebhook = async () => {
    if (!newWebhookUrl.trim()) {
      pushToast("Enter an endpoint URL first", "error");
      return;
    }
    setCreatingWebhook(true);
    try {
      const res = await fetch("/api/developer/webhooks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: newWebhookUrl, description: newWebhookDesc }),
      });
      const data = await res.json();
      if (!res.ok) {
        pushToast(data.error || "Failed to create webhook", "error");
        return;
      }
      setNewWebhookUrl("");
      setNewWebhookDesc("");
      await loadWebhooks();
      pushToast("Webhook created", "success");
    } catch {
      pushToast("Failed to create webhook", "error");
    } finally {
      setCreatingWebhook(false);
    }
  };

  const handleToggleWebhook = async (id: string, isActive: boolean) => {
    try {
      const res = await fetch("/api/developer/webhooks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isActive: !isActive }),
      });
      const data = await res.json();
      if (!res.ok) {
        pushToast(data.error || "Failed to update webhook", "error");
        return;
      }
      setWebhooks((w) => w.map((wh) => (wh.id === id ? data.webhook : wh)));
    } catch {
      pushToast("Failed to update webhook", "error");
    }
  };

  const handleDeleteWebhook = async (id: string) => {
    try {
      const res = await fetch(`/api/developer/webhooks?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        pushToast(data.error || "Failed to delete webhook", "error");
        return;
      }
      setWebhooks((w) => w.filter((wh) => wh.id !== id));
      pushToast("Webhook deleted", "success");
    } catch {
      pushToast("Failed to delete webhook", "error");
    } finally {
      setConfirmDeleteWebhookId(null);
    }
  };

  const handleTestWebhook = async (id: string) => {
    setTestingId(id);
    try {
      const res = await fetch("/api/developer/webhooks/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      pushToast(
        data.success ? `Test event delivered (HTTP ${data.httpStatus})` : "Test event failed to deliver",
        data.success ? "success" : "error"
      );
      await loadWebhooks();
    } catch {
      pushToast("Failed to send test event", "error");
    } finally {
      setTestingId(null);
    }
  };

  return (
    <>
      {/* Toasts */}
      <div style={{ position: "fixed", top: 24, right: 24, zIndex: 1000, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {toasts.map((t) => (
          <div
            key={t.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "0.9rem 1.25rem",
              borderRadius: "12px",
              background: t.kind === "success" ? "rgba(34,197,94,0.15)" : "rgba(255,51,102,0.15)",
              border: `1px solid ${t.kind === "success" ? "rgba(34,197,94,0.3)" : "rgba(255,51,102,0.3)"}`,
              color: t.kind === "success" ? "#22c55e" : "#FF3366",
              fontWeight: 600,
              fontSize: "0.9rem",
              minWidth: "260px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
            }}
          >
            {t.kind === "success" ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
            {t.message}
          </div>
        ))}
      </div>

      {/* Revealed key modal */}
      {revealedKey && (
        <div style={{ position: "fixed", inset: 0, zIndex: 999, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(10px)" }}>
          <div style={{ background: "#111", padding: "2.5rem", borderRadius: "24px", width: "90%", maxWidth: "560px", border: "1px solid rgba(0,229,255,0.3)" }}>
            <h3 style={{ fontSize: "1.4rem", marginBottom: "0.5rem" }}>Your new API key</h3>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
              Copy this now — for security, it will not be shown again.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", background: "#000", padding: "1rem", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", marginBottom: "1.5rem" }}>
              <code style={{ flex: 1, fontFamily: "monospace", color: "#00E5FF", fontSize: "0.95rem", wordBreak: "break-all" }}>
                {revealedKey}
              </code>
              <button onClick={() => handleCopy(revealedKey, "API key")} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.6)", cursor: "pointer" }}>
                <Copy size={20} />
              </button>
            </div>
            <button onClick={() => setRevealedKey(null)} className={styles.btnPrimary} style={{ width: "100%", justifyContent: "center" }}>
              I've copied my key
            </button>
          </div>
        </div>
      )}

      {/* Confirm revoke key modal */}
      {confirmRevokeId && (
        <div style={{ position: "fixed", inset: 0, zIndex: 999, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(10px)" }}>
          <div style={{ background: "#111", padding: "2.5rem", borderRadius: "24px", width: "90%", maxWidth: "480px", border: "1px solid rgba(255,51,102,0.3)", textAlign: "center" }}>
            <AlertTriangle size={40} color="#FF3366" style={{ margin: "0 auto 1rem" }} />
            <h3 style={{ fontSize: "1.3rem", marginBottom: "0.75rem" }}>Revoke this key?</h3>
            <p style={{ color: "rgba(255,255,255,0.6)", marginBottom: "2rem" }}>
              Any application using this key will immediately lose access.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
              <button onClick={() => setConfirmRevokeId(null)} className={styles.btnSecondary}>Cancel</button>
              <button onClick={() => handleRevokeKey(confirmRevokeId)} className={styles.btnDanger}>Revoke Key</button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm delete webhook modal */}
      {confirmDeleteWebhookId && (
        <div style={{ position: "fixed", inset: 0, zIndex: 999, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(10px)" }}>
          <div style={{ background: "#111", padding: "2.5rem", borderRadius: "24px", width: "90%", maxWidth: "480px", border: "1px solid rgba(255,51,102,0.3)", textAlign: "center" }}>
            <AlertTriangle size={40} color="#FF3366" style={{ margin: "0 auto 1rem" }} />
            <h3 style={{ fontSize: "1.3rem", marginBottom: "0.75rem" }}>Delete this webhook?</h3>
            <p style={{ color: "rgba(255,255,255,0.6)", marginBottom: "2rem" }}>
              This endpoint will stop receiving events immediately.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
              <button onClick={() => setConfirmDeleteWebhookId(null)} className={styles.btnSecondary}>Cancel</button>
              <button onClick={() => handleDeleteWebhook(confirmDeleteWebhookId)} className={styles.btnDanger}>Delete</button>
            </div>
          </div>
        </div>
      )}

      <h1 className={styles.pageTitle} style={{ margin: 0 }}>Developer Portal</h1>
      <p className={styles.pageDesc}>Manage your API keys, webhooks, and integrate Bohenix services into your infrastructure.</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))", gap: "2rem", alignItems: "start" }}>

        {/* API Keys */}
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "20px", padding: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "1.25rem" }}>
            <Key size={24} color="#B14CFF" />
            <h2 style={{ fontSize: "1.4rem", fontWeight: 600, margin: 0 }}>API Keys</h2>
          </div>

          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
            Create scoped keys to authenticate with Bohenix APIs. Keys are shown once at creation.
          </p>

          <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem" }}>
            <input
              type="text"
              placeholder="Key name (e.g. Production Server)"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              style={{ flex: 1, background: "#000", padding: "0.85rem 1rem", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", outline: "none" }}
            />
            <button onClick={handleCreateKey} disabled={creatingKey} className={styles.btnPrimary} style={{ whiteSpace: "nowrap", opacity: creatingKey ? 0.6 : 1 }}>
              <Plus size={16} /> {creatingKey ? "Creating..." : "New Key"}
            </button>
          </div>

          {loadingKeys ? (
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.9rem" }}>Loading keys...</p>
          ) : keys.length === 0 ? (
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.9rem" }}>No API keys yet. Create one above to get started.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {keys.map((k) => (
                <div key={k.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#000", padding: "1rem", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div>
                    <div style={{ fontWeight: 600, marginBottom: "0.25rem" }}>{k.name}</div>
                    <code style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)" }}>{k.keyPrefix}...</code>
                    <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.35)", marginTop: "0.25rem" }}>
                      {k.lastUsedAt ? `Last used ${new Date(k.lastUsedAt).toLocaleDateString()}` : "Never used"}
                    </div>
                  </div>
                  <button onClick={() => setConfirmRevokeId(k.id)} style={{ background: "none", border: "none", color: "#FF3366", cursor: "pointer", padding: "0.5rem" }} aria-label="Revoke key">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Webhooks */}
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "20px", padding: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "1.25rem" }}>
            <WebhookIcon size={24} color="#00E5FF" />
            <h2 style={{ fontSize: "1.4rem", fontWeight: 600, margin: 0 }}>Webhooks</h2>
          </div>

          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
            Receive real-time JSON payloads for ecosystem events at your endpoint.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem" }}>
            <input
              type="url"
              placeholder="https://yourapp.com/webhooks/bohenix"
              value={newWebhookUrl}
              onChange={(e) => setNewWebhookUrl(e.target.value)}
              style={{ background: "#000", padding: "0.85rem 1rem", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", outline: "none" }}
            />
            <input
              type="text"
              placeholder="Description (optional)"
              value={newWebhookDesc}
              onChange={(e) => setNewWebhookDesc(e.target.value)}
              style={{ background: "#000", padding: "0.85rem 1rem", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", outline: "none" }}
            />
            <button onClick={handleCreateWebhook} disabled={creatingWebhook} className={styles.btnPrimary} style={{ justifyContent: "center", opacity: creatingWebhook ? 0.6 : 1 }}>
              <Plus size={16} /> {creatingWebhook ? "Adding..." : "Add Webhook"}
            </button>
          </div>

          {loadingWebhooks ? (
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.9rem" }}>Loading webhooks...</p>
          ) : webhooks.length === 0 ? (
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.9rem" }}>No webhooks configured yet.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {webhooks.map((w) => (
                <div key={w.id} style={{ background: "#000", padding: "1rem", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 600, wordBreak: "break-all" }}>{w.url}</div>
                      {w.description && <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)" }}>{w.description}</div>}
                    </div>
                    <button onClick={() => setConfirmDeleteWebhookId(w.id)} style={{ background: "none", border: "none", color: "#FF3366", cursor: "pointer", padding: "0.25rem", flexShrink: 0 }} aria-label="Delete webhook">
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap", marginTop: "0.75rem" }}>
                    <span
                      onClick={() => handleToggleWebhook(w.id, w.isActive)}
                      style={{
                        cursor: "pointer",
                        padding: "4px 10px",
                        borderRadius: "999px",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        background: w.isActive ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.08)",
                        color: w.isActive ? "#22c55e" : "rgba(255,255,255,0.5)",
                      }}
                    >
                      {w.isActive ? "Active" : "Paused"}
                    </span>

                    {w.lastStatus && (
                      <span style={{ fontSize: "0.75rem", color: w.lastStatus === "success" ? "#22c55e" : "#FF3366" }}>
                        Last delivery: {w.lastStatus}
                      </span>
                    )}

                    <button
                      onClick={() => handleTestWebhook(w.id)}
                      disabled={testingId === w.id}
                      style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "6px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "0.4rem 0.75rem", color: "#fff", fontSize: "0.8rem", cursor: "pointer", opacity: testingId === w.id ? 0.6 : 1 }}
                    >
                      <Send size={14} /> {testingId === w.id ? "Sending..." : "Send Test"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: "3rem", background: "rgba(177, 76, 255, 0.05)", border: "1px solid rgba(177, 76, 255, 0.2)", borderRadius: "20px", padding: "2rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "2rem" }}>
        <div>
          <h3 style={{ fontSize: "1.4rem", fontWeight: 600, marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "10px" }}>
            <BookOpen size={24} color="#B14CFF" /> Documentation & SDKs
          </h3>
          <p style={{ color: "rgba(255,255,255,0.7)", margin: 0 }}>
            Read the official API documentation and explore integration guides.
          </p>
        </div>
        <a href="/developers" className={styles.btnSecondary} style={{ background: "#fff", color: "#000" }}>
          View Documentation
        </a>
      </div>
    </>
  );
}
'''

with open(path, "w") as f:
    f.write(content)

print(f"Wrote {path}")
