"use client";

import React, { useEffect, useState } from "react";
import styles from "../dashboard.module.css";
import { useAuth } from "@/context/AuthContext";
import { useLanguage, Language } from "@/context/LanguageContext";
import {
  User,
  Lock,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Copy,
  Loader2,
  Sun,
  Moon,
  Monitor,
  Globe,
  CreditCard,
  Zap,
  Sparkles,
  ArrowRight,
  KeyRound,
  Shield
} from "lucide-react";

type Toast = { id: number; message: string; kind: "success" | "error" };
type ThemeMode = "dark" | "light" | "system";

type SubData = {
  active: boolean;
  plan: string | null;
  status: string | null;
  currentPeriodEnd: string | null;
};

export default function SettingsPage() {
  const { user } = useAuth();
  const [toasts, setToasts] = useState<Toast[]>([]);

  const pushToast = (message: string, kind: "success" | "error") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, kind }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  };

  // Appearance
  const [theme, setTheme] = useState<ThemeMode>("dark");

  useEffect(() => {
    const saved = localStorage.getItem("bx_theme") as ThemeMode | null;
    if (saved) setTheme(saved);
  }, []);

  const handleThemeChange = (mode: ThemeMode) => {
    setTheme(mode);
    localStorage.setItem("bx_theme", mode);
    pushToast(`Appearance set to ${mode.charAt(0).toUpperCase() + mode.slice(1)}`, "success");
  };

  // Language
  const { language, setLanguage, t } = useLanguage();

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    pushToast(`Language set to ${lang === "en" ? "English" : "Kiswahili"}`, "success");
  };

  // Billing
  const [subData, setSubData] = useState<SubData | null>(null);
  const [loadingSub, setLoadingSub] = useState(true);

  useEffect(() => {
    fetch("/api/account/subscription")
      .then((res) => res.json())
      .then((d) => { if (!d.error) setSubData(d); })
      .catch(() => {})
      .finally(() => setLoadingSub(false));
  }, []);

  // Profile
  const [name, setName] = useState(user?.name || "");
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    if (user?.name) setName(user.name);
  }, [user?.name]);

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      const res = await fetch("/api/account/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (!res.ok) {
        pushToast(data.error || "Failed to update profile", "error");
        return;
      }
      pushToast("Profile updated successfully", "success");
    } catch {
      pushToast("Failed to update profile", "error");
    } finally {
      setSavingProfile(false);
    }
  };

  // Password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [hasPassword, setHasPassword] = useState(true);

  const handleChangePassword = async () => {
    setSavingPassword(true);
    try {
      const res = await fetch("/api/account/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        pushToast(data.error || "Failed to update password", "error");
        return;
      }
      pushToast("Password updated successfully", "success");
      setCurrentPassword("");
      setNewPassword("");
      setHasPassword(true);
    } catch {
      pushToast("Failed to update password", "error");
    } finally {
      setSavingPassword(false);
    }
  };

  // 2FA
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [backupCodesRemaining, setBackupCodesRemaining] = useState(0);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [verifyCode, setVerifyCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [revealedBackupCodes, setRevealedBackupCodes] = useState<string[] | null>(null);
  const [disablePassword, setDisablePassword] = useState("");
  const [showDisableConfirm, setShowDisableConfirm] = useState(false);
  const [disabling, setDisabling] = useState(false);

  const loadStatus = async () => {
    setLoadingStatus(true);
    try {
      const res = await fetch("/api/2fa/status");
      const data = await res.json();
      if (res.ok) {
        setTwoFactorEnabled(data.twoFactorEnabled);
        setHasPassword(data.hasPassword);
        setBackupCodesRemaining(data.backupCodesRemaining || 0);
      }
    } finally {
      setLoadingStatus(false);
    }
  };

  useEffect(() => {
    loadStatus();
  }, []);

  const handleStartEnroll = async () => {
    setEnrolling(true);
    try {
      const res = await fetch("/api/2fa/setup", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        pushToast(data.error || "Failed to start 2FA setup", "error");
        setEnrolling(false);
        return;
      }
      setQrCodeDataUrl(data.qrCodeDataUrl);
      setSecret(data.secret);
    } catch {
      pushToast("Failed to start 2FA setup", "error");
      setEnrolling(false);
    }
  };

  const handleVerify = async () => {
    if (!verifyCode) {
      pushToast("Enter the 6-digit code from your authenticator app", "error");
      return;
    }
    setVerifying(true);
    try {
      const res = await fetch("/api/2fa/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: verifyCode }),
      });
      const data = await res.json();
      if (!res.ok) {
        pushToast(data.error || "Invalid code", "error");
        return;
      }
      setRevealedBackupCodes(data.backupCodes);
      setTwoFactorEnabled(true);
      setEnrolling(false);
      setQrCodeDataUrl(null);
      setSecret(null);
      setVerifyCode("");
      pushToast("Two-factor authentication enabled", "success");
      loadStatus();
    } catch {
      pushToast("Failed to verify code", "error");
    } finally {
      setVerifying(false);
    }
  };

  const handleDisable = async () => {
    setDisabling(true);
    try {
      const res = await fetch("/api/2fa/disable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: disablePassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        pushToast(data.error || "Failed to disable 2FA", "error");
        return;
      }
      setTwoFactorEnabled(false);
      setShowDisableConfirm(false);
      setDisablePassword("");
      pushToast("Two-factor authentication disabled", "success");
      loadStatus();
    } catch {
      pushToast("Failed to disable 2FA", "error");
    } finally {
      setDisabling(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    pushToast("Copied to clipboard", "success");
  };

  return (
    <>
      {/* Toast Notifications */}
      <div style={{ position: "fixed", top: 24, right: 24, zIndex: 1000, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {toasts.map((t) => (
          <div
            key={t.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "1rem 1.4rem",
              borderRadius: "14px",
              background: t.kind === "success" ? "rgba(34,197,94,0.15)" : "rgba(255,51,102,0.15)",
              border: `1px solid ${t.kind === "success" ? "rgba(34,197,94,0.4)" : "rgba(255,51,102,0.4)"}`,
              color: t.kind === "success" ? "#22c55e" : "#FF3366",
              fontWeight: 600,
              fontSize: "0.9rem",
              minWidth: "280px",
              backdropFilter: "blur(16px)",
              boxShadow: "0 16px 40px rgba(0,0,0,0.5)",
            }}
          >
            {t.kind === "success" ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
            {t.message}
          </div>
        ))}
      </div>

      {/* Backup Codes Reveal Modal */}
      {revealedBackupCodes && (
        <div style={{ position: "fixed", inset: 0, zIndex: 999, background: "rgba(5, 3, 15, 0.85)", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(16px)" }}>
          <div style={{ background: "rgba(15, 12, 28, 0.95)", padding: "2.5rem", borderRadius: "24px", width: "90%", maxWidth: "520px", border: "1px solid rgba(34,197,94,0.3)", boxShadow: "0 24px 64px rgba(0,0,0,0.7)" }}>
            <h3 style={{ fontSize: "1.4rem", marginBottom: "0.5rem", color: "#fff" }}>Save your backup codes</h3>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
              Each code can be used once if you lose access to your authenticator app. Store them safely.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.5rem", background: "rgba(0,0,0,0.6)", padding: "1.25rem", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.1)", marginBottom: "1.5rem" }}>
              {revealedBackupCodes.map((code) => (
                <code key={code} style={{ fontFamily: "monospace", color: "#00E5FF", fontSize: "0.95rem" }}>{code}</code>
              ))}
            </div>
            <div style={{ display: "flex", gap: "1rem" }}>
              <button onClick={() => handleCopy(revealedBackupCodes.join("\n"))} className={styles.btnSecondary} style={{ flex: 1, justifyContent: "center" }}>
                <Copy size={16} /> Copy All
              </button>
              <button onClick={() => setRevealedBackupCodes(null)} className={styles.btnPrimary} style={{ flex: 1, justifyContent: "center" }}>
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Disable 2FA Confirm Modal */}
      {showDisableConfirm && (
        <div style={{ position: "fixed", inset: 0, zIndex: 999, background: "rgba(5, 3, 15, 0.85)", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(16px)" }}>
          <div style={{ background: "rgba(15, 12, 28, 0.95)", padding: "2.5rem", borderRadius: "24px", width: "90%", maxWidth: "440px", border: "1px solid rgba(255,51,102,0.3)", boxShadow: "0 24px 64px rgba(0,0,0,0.7)" }}>
            <h3 style={{ fontSize: "1.3rem", marginBottom: "0.75rem", color: "#fff" }}>Disable two-factor authentication?</h3>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
              Your account will only be protected by your password.
            </p>
            {hasPassword && (
              <input
                type="password"
                placeholder="Confirm your password"
                value={disablePassword}
                onChange={(e) => setDisablePassword(e.target.value)}
                style={{ width: "100%", background: "rgba(0,0,0,0.5)", padding: "0.85rem 1rem", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.12)", color: "#fff", outline: "none", marginBottom: "1.5rem" }}
              />
            )}
            <div style={{ display: "flex", gap: "1rem" }}>
              <button onClick={() => setShowDisableConfirm(false)} className={styles.btnSecondary} style={{ flex: 1 }}>Cancel</button>
              <button onClick={handleDisable} disabled={disabling} className={styles.btnDanger} style={{ flex: 1, opacity: disabling ? 0.6 : 1 }}>
                {disabling ? "Disabling..." : "Disable 2FA"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2rem" }}>
        <div>
          <h1 className={styles.pageTitle} style={{ fontSize: "2rem", letterSpacing: "-0.03em" }}>Account Settings & Governance</h1>
          <p className={styles.pageDesc} style={{ margin: 0 }}>Configure workspace themes, enterprise security, M-Pesa billing, and preferences.</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(123,45,255,0.1)", border: "1px solid rgba(123,45,255,0.3)", padding: "0.4rem 0.9rem", borderRadius: "20px", fontSize: "0.8rem", color: "#B14CFF", fontWeight: 600 }}>
          <Shield size={14} /> Enterprise Governed
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>

        {/* 1. Appearance Section */}
        <div style={{ background: "rgba(15, 12, 28, 0.6)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "24px", padding: "2.25rem", boxShadow: "0 12px 36px rgba(0,0,0,0.4)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "0.5rem" }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(245, 158, 11, 0.12)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(245, 158, 11, 0.3)" }}>
              <Sun size={22} color="#f59e0b" />
            </div>
            <div>
              <h2 style={{ fontSize: "1.3rem", fontWeight: 700, margin: 0, color: "#fff" }}>Appearance</h2>
              <span style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.5)" }}>Choose how Bohenix looks to you across devices.</span>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem", marginTop: "1.5rem" }}>
            {([
              { mode: "dark" as ThemeMode, icon: <Moon size={20} color="#7B2DFF" />, label: "Dark Mode", desc: "Default High-Contrast Cyber aesthetic" },
              { mode: "light" as ThemeMode, icon: <Sun size={20} color="#f59e0b" />, label: "Light Mode", desc: "High-visibility daytime interface" },
              { mode: "system" as ThemeMode, icon: <Monitor size={20} color="#00E5FF" />, label: "System Sync", desc: "Syncs with your OS settings" },
            ]).map((opt) => (
              <button
                key={opt.mode}
                onClick={() => handleThemeChange(opt.mode)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  padding: "1.25rem",
                  borderRadius: "16px",
                  background: theme === opt.mode ? "linear-gradient(135deg, rgba(123,45,255,0.2) 0%, rgba(0,240,255,0.05) 100%)" : "rgba(255,255,255,0.02)",
                  border: theme === opt.mode ? "1px solid #7B2DFF" : "1px solid rgba(255,255,255,0.06)",
                  color: theme === opt.mode ? "#fff" : "rgba(255,255,255,0.7)",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                  boxShadow: theme === opt.mode ? "0 8px 24px rgba(123,45,255,0.25)" : "none",
                  fontFamily: "inherit",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                  {opt.icon}
                  {theme === opt.mode && <CheckCircle2 size={18} color="#7B2DFF" />}
                </div>
                <span style={{ fontWeight: 700, fontSize: "1rem", color: "#fff", marginTop: "4px" }}>{opt.label}</span>
                <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)" }}>{opt.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Billing & Subscription Section */}
        <div style={{ background: "rgba(15, 12, 28, 0.6)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "24px", padding: "2.25rem", boxShadow: "0 12px 36px rgba(0,0,0,0.4)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(0, 229, 255, 0.12)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(0, 229, 255, 0.3)" }}>
                <CreditCard size={22} color="#00E5FF" />
              </div>
              <div>
                <h2 style={{ fontSize: "1.3rem", fontWeight: 700, margin: 0, color: "#fff" }}>Billing & Subscription</h2>
                <span style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.5)" }}>Manage your Bohenix plan tier, M-Pesa payments, and quotas.</span>
              </div>
            </div>

            <span style={{ fontSize: "0.75rem", padding: "4px 12px", borderRadius: "20px", background: subData?.active ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.05)", border: subData?.active ? "1px solid rgba(34,197,94,0.3)" : "1px solid rgba(255,255,255,0.1)", color: subData?.active ? "#22c55e" : "rgba(255,255,255,0.6)", fontWeight: 600 }}>
              {subData?.active ? `PRO PLAN ACTIVE (${subData.plan})` : "FREE / STARTER TIER"}
            </span>
          </div>

          {loadingSub ? (
            <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "rgba(255,255,255,0.4)", padding: "1.5rem" }}>
              <Loader2 size={18} className="animate-spin" /> Loading subscription telemetry...
            </div>
          ) : subData?.active ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "1rem 1.25rem", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)", borderRadius: "14px", color: "#22c55e", fontWeight: 600 }}>
                <CheckCircle2 size={20} />
                Active Subscription — {subData.plan} Plan
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: "14px", padding: "1.25rem", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)", margin: "0 0 4px" }}>Status</p>
                  <p style={{ fontSize: "1.1rem", fontWeight: 700, color: "#22c55e", margin: 0, textTransform: "capitalize" }}>{subData.status}</p>
                </div>
                <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: "14px", padding: "1.25rem", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)", margin: "0 0 4px" }}>Renewal Date</p>
                  <p style={{ fontSize: "1.1rem", fontWeight: 700, margin: 0, color: "#fff" }}>
                    {subData.currentPeriodEnd ? new Date(subData.currentPeriodEnd).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", background: "rgba(255,255,255,0.02)", padding: "1.5rem", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(123,45,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(123,45,255,0.3)" }}>
                  <Sparkles color="#7B2DFF" size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#fff", margin: 0 }}>Unlock Unlimited Autonomous AI Employees</h3>
                  <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.5)", margin: 0 }}>Deploy full department agents with Daraja M-Pesa auto-reconciliations & 24/7 priority SLAs.</p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
                <a 
                  href="/flow-ai" 
                  style={{ 
                    display: "inline-flex", 
                    alignItems: "center", 
                    gap: "10px", 
                    padding: "0.85rem 1.75rem", 
                    background: "linear-gradient(135deg, #7B2DFF 0%, #00F0FF 100%)", 
                    color: "#fff", 
                    borderRadius: "14px", 
                    fontWeight: 700, 
                    fontSize: "0.95rem", 
                    textDecoration: "none", 
                    boxShadow: "0 8px 24px rgba(123, 45, 255, 0.3)",
                    transition: "all 0.2s" 
                  }}
                >
                  <Zap size={18} />
                  <span>Subscribe to Flow AI</span>
                  <ArrowRight size={16} />
                </a>

                <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.4)" }}>
                  Supports M-Pesa STK Push & Credit Cards
                </span>
              </div>
            </div>
          )}
        </div>

        {/* 3. Language Preference Section */}
        <div style={{ background: "rgba(15, 12, 28, 0.6)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "24px", padding: "2.25rem", boxShadow: "0 12px 36px rgba(0,0,0,0.4)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "0.5rem" }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(0, 229, 255, 0.12)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(0, 229, 255, 0.3)" }}>
              <Globe size={22} color="#00E5FF" />
            </div>
            <div>
              <h2 style={{ fontSize: "1.3rem", fontWeight: 700, margin: 0, color: "#fff" }}>Language & Localization</h2>
              <span style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.5)" }}>Set your preferred language for the Bohenix platform interface.</span>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginTop: "1.5rem" }}>
            {([
              { code: "en" as Language, label: "English", flag: "🇬🇧", region: "Global / Default" },
              { code: "sw" as Language, label: "Kiswahili", flag: "🇰🇪", region: "East Africa Native" },
            ]).map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  padding: "1.25rem",
                  borderRadius: "16px",
                  background: language === lang.code ? "rgba(0,229,255,0.12)" : "rgba(255,255,255,0.02)",
                  border: language === lang.code ? "1px solid #00E5FF" : "1px solid rgba(255,255,255,0.06)",
                  color: language === lang.code ? "#fff" : "rgba(255,255,255,0.7)",
                  cursor: "pointer",
                  fontWeight: language === lang.code ? 700 : 500,
                  fontSize: "0.95rem",
                  transition: "all 0.2s",
                  fontFamily: "inherit",
                }}
              >
                <span style={{ fontSize: "1.75rem" }}>{lang.flag}</span>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontWeight: 700, color: "#fff" }}>{lang.label}</div>
                  <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)" }}>{lang.region}</div>
                </div>
                {language === lang.code && <CheckCircle2 size={20} color="#00E5FF" style={{ marginLeft: "auto" }} />}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Profile Section */}
        <div style={{ background: "rgba(15, 12, 28, 0.6)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "24px", padding: "2.25rem", boxShadow: "0 12px 36px rgba(0,0,0,0.4)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "1.5rem" }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(177, 76, 255, 0.12)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(177, 76, 255, 0.3)" }}>
              <User size={22} color="#B14CFF" />
            </div>
            <div>
              <h2 style={{ fontSize: "1.3rem", fontWeight: 700, margin: 0, color: "#fff" }}>Account Profile</h2>
              <span style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.5)" }}>Update your personal workspace identity.</span>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem", marginBottom: "1.5rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", color: "rgba(255,255,255,0.6)", marginBottom: "0.5rem", fontWeight: 600 }}>Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ width: "100%", background: "rgba(0,0,0,0.5)", padding: "0.85rem 1rem", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.12)", color: "#fff", outline: "none", fontSize: "0.95rem" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", color: "rgba(255,255,255,0.6)", marginBottom: "0.5rem", fontWeight: 600 }}>Email Address</label>
              <input
                type="email"
                value={user?.email || ""}
                disabled
                style={{ width: "100%", background: "rgba(0,0,0,0.3)", padding: "0.85rem 1rem", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)", outline: "none", fontSize: "0.95rem" }}
              />
            </div>
          </div>

          <button onClick={handleSaveProfile} disabled={savingProfile} className={styles.btnPrimary} style={{ opacity: savingProfile ? 0.6 : 1 }}>
            {savingProfile ? <Loader2 size={16} className="animate-spin" /> : null}
            <span>{savingProfile ? "Saving..." : "Save Profile Changes"}</span>
          </button>
        </div>

        {/* 5. Password & 2FA Section */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem" }}>
          {/* Password */}
          <div style={{ background: "rgba(15, 12, 28, 0.6)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "24px", padding: "2rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(0, 229, 255, 0.12)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(0, 229, 255, 0.3)" }}>
                <Lock size={22} color="#00E5FF" />
              </div>
              <h2 style={{ fontSize: "1.2rem", fontWeight: 700, margin: 0, color: "#fff" }}>Security & Password</h2>
            </div>

            {hasPassword && (
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "rgba(255,255,255,0.6)", marginBottom: "0.5rem" }}>Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  style={{ width: "100%", background: "rgba(0,0,0,0.5)", padding: "0.85rem 1rem", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.12)", color: "#fff", outline: "none" }}
                />
              </div>
            )}
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", color: "rgba(255,255,255,0.6)", marginBottom: "0.5rem" }}>New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 8 characters"
                style={{ width: "100%", background: "rgba(0,0,0,0.5)", padding: "0.85rem 1rem", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.12)", color: "#fff", outline: "none" }}
              />
            </div>

            <button onClick={handleChangePassword} disabled={savingPassword} className={styles.btnPrimary} style={{ marginTop: "auto", opacity: savingPassword ? 0.6 : 1 }}>
              {savingPassword ? "Updating..." : hasPassword ? "Update Password" : "Set Password"}
            </button>
          </div>

          {/* 2FA */}
          <div style={{ background: "rgba(15, 12, 28, 0.6)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "24px", padding: "2rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(34, 197, 94, 0.12)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(34, 197, 94, 0.3)" }}>
                <ShieldCheck size={22} color="#22c55e" />
              </div>
              <h2 style={{ fontSize: "1.2rem", fontWeight: 700, margin: 0, color: "#fff" }}>Two-Factor (TOTP)</h2>
            </div>

            {loadingStatus ? (
              <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "rgba(255,255,255,0.4)" }}>
                <Loader2 size={18} className="animate-spin" /> Checking 2FA status...
              </div>
            ) : twoFactorEnabled ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "1rem", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)", borderRadius: "12px", color: "#22c55e", fontWeight: 600 }}>
                  <CheckCircle2 size={20} /> 2FA Protection Active
                </div>
                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.85rem", margin: 0 }}>
                  {backupCodesRemaining} backup codes remaining for recovery.
                </p>
                <button onClick={() => setShowDisableConfirm(true)} className={styles.btnDanger} style={{ marginTop: "auto" }}>
                  Disable 2FA Protection
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.85rem", margin: 0 }}>
                  Require a 6-digit TOTP code from Google Authenticator or Authy when logging in.
                </p>
                <button onClick={handleStartEnroll} className={styles.btnPrimary} style={{ marginTop: "auto" }}>
                  <KeyRound size={16} /> Enable 2FA Security
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </>
  );
}
