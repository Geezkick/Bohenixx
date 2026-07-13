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
      pushToast("Profile updated", "success");
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
      pushToast("Password updated", "success");
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

      {/* Backup codes reveal modal */}
      {revealedBackupCodes && (
        <div style={{ position: "fixed", inset: 0, zIndex: 999, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(10px)" }}>
          <div style={{ background: "#111", padding: "2.5rem", borderRadius: "24px", width: "90%", maxWidth: "520px", border: "1px solid rgba(34,197,94,0.3)" }}>
            <h3 style={{ fontSize: "1.4rem", marginBottom: "0.5rem" }}>Save your backup codes</h3>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
              Each code can be used once if you lose access to your authenticator app. Store them somewhere safe — they will not be shown again.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.5rem", background: "#000", padding: "1.25rem", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", marginBottom: "1.5rem" }}>
              {revealedBackupCodes.map((code) => (
                <code key={code} style={{ fontFamily: "monospace", color: "#00E5FF", fontSize: "0.95rem" }}>{code}</code>
              ))}
            </div>
            <div style={{ display: "flex", gap: "1rem" }}>
              <button onClick={() => handleCopy(revealedBackupCodes.join("\n"))} className={styles.btnSecondary} style={{ flex: 1, justifyContent: "center", display: "flex", alignItems: "center", gap: "8px" }}>
                <Copy size={16} /> Copy All
              </button>
              <button onClick={() => setRevealedBackupCodes(null)} className={styles.btnPrimary} style={{ flex: 1, justifyContent: "center" }}>
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Disable confirm modal */}
      {showDisableConfirm && (
        <div style={{ position: "fixed", inset: 0, zIndex: 999, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(10px)" }}>
          <div style={{ background: "#111", padding: "2.5rem", borderRadius: "24px", width: "90%", maxWidth: "440px", border: "1px solid rgba(255,51,102,0.3)" }}>
            <h3 style={{ fontSize: "1.3rem", marginBottom: "0.75rem" }}>Disable two-factor authentication?</h3>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
              Your account will only be protected by your password.
            </p>
            {hasPassword && (
              <input
                type="password"
                placeholder="Confirm your password"
                value={disablePassword}
                onChange={(e) => setDisablePassword(e.target.value)}
                style={{ width: "100%", background: "#000", padding: "0.85rem 1rem", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", outline: "none", marginBottom: "1.5rem" }}
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

      <h1 className={styles.pageTitle}>Account Settings</h1>
      <p className={styles.pageDesc}>Manage your profile, password, and account security.</p>

      <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>

        {/* Profile */}
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "20px", padding: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "1.5rem" }}>
            <User size={24} color="#B14CFF" />
            <h2 style={{ fontSize: "1.3rem", fontWeight: 600, margin: 0 }}>Profile</h2>
          </div>
          <div style={{ marginBottom: "1.5rem", maxWidth: "420px" }}>
            <label style={{ display: "block", fontSize: "0.85rem", color: "rgba(255,255,255,0.5)", marginBottom: "0.5rem" }}>Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: "100%", background: "#000", padding: "0.85rem 1rem", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", outline: "none" }}
            />
          </div>
          <div style={{ marginBottom: "1.5rem", maxWidth: "420px" }}>
            <label style={{ display: "block", fontSize: "0.85rem", color: "rgba(255,255,255,0.5)", marginBottom: "0.5rem" }}>Email</label>
            <input
              type="email"
              value={user?.email || ""}
              disabled
              style={{ width: "100%", background: "#000", padding: "0.85rem 1rem", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)", outline: "none" }}
            />
          </div>
          <button onClick={handleSaveProfile} disabled={savingProfile} className={styles.btnPrimary} style={{ opacity: savingProfile ? 0.6 : 1 }}>
            {savingProfile ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {/* Password */}
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "20px", padding: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "1.5rem" }}>
            <Lock size={24} color="#00E5FF" />
            <h2 style={{ fontSize: "1.3rem", fontWeight: 600, margin: 0 }}>Password</h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "420px", marginBottom: "1.5rem" }}>
            {hasPassword && (
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "rgba(255,255,255,0.5)", marginBottom: "0.5rem" }}>Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  style={{ width: "100%", background: "#000", padding: "0.85rem 1rem", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", outline: "none" }}
                />
              </div>
            )}
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", color: "rgba(255,255,255,0.5)", marginBottom: "0.5rem" }}>New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 8 characters"
                style={{ width: "100%", background: "#000", padding: "0.85rem 1rem", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", outline: "none" }}
              />
            </div>
          </div>
          <button onClick={handleChangePassword} disabled={savingPassword} className={styles.btnPrimary} style={{ opacity: savingPassword ? 0.6 : 1 }}>
            {savingPassword ? "Updating..." : hasPassword ? "Update Password" : "Set Password"}
          </button>
        </div>

        {/* 2FA */}
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "20px", padding: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "1.5rem" }}>
            <ShieldCheck size={24} color="#22c55e" />
            <h2 style={{ fontSize: "1.3rem", fontWeight: 600, margin: 0 }}>Two-Factor Authentication</h2>
          </div>

          {loadingStatus ? (
            <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "rgba(255,255,255,0.4)" }}>
              <Loader2 size={18} /> Loading...
            </div>
          ) : twoFactorEnabled ? (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "1rem", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: "12px", color: "#22c55e", fontWeight: 600, marginBottom: "1.5rem" }}>
                <CheckCircle2 size={20} /> Two-factor authentication is enabled
              </div>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
                {backupCodesRemaining} backup code{backupCodesRemaining === 1 ? "" : "s"} remaining.
              </p>
              <button onClick={() => setShowDisableConfirm(true)} className={styles.btnDanger}>
                Disable Two-Factor Authentication
              </button>
            </>
          ) : enrolling ? (
            <div style={{ maxWidth: "420px" }}>
              {qrCodeDataUrl ? (
                <>
                  <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
                    Scan this QR code with Google Authenticator, Authy, or any TOTP app.
                  </p>
                  <div style={{ background: "#fff", padding: "1rem", borderRadius: "12px", display: "inline-block", marginBottom: "1.5rem" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={qrCodeDataUrl} alt="2FA QR Code" width={200} height={200} />
                  </div>
                  {secret && (
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", background: "#000", padding: "0.85rem 1rem", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", marginBottom: "1.5rem" }}>
                      <code style={{ flex: 1, fontFamily: "monospace", color: "#00E5FF", fontSize: "0.85rem", wordBreak: "break-all" }}>{secret}</code>
                      <button onClick={() => handleCopy(secret)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.6)", cursor: "pointer" }}>
                        <Copy size={18} />
                      </button>
                    </div>
                  )}
                  <label style={{ display: "block", fontSize: "0.85rem", color: "rgba(255,255,255,0.5)", marginBottom: "0.5rem" }}>Enter the 6-digit code to confirm</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={verifyCode}
                    onChange={(e) => setVerifyCode(e.target.value)}
                    placeholder="123456"
                    style={{ width: "100%", background: "#000", padding: "0.85rem 1rem", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", outline: "none", marginBottom: "1rem" }}
                  />
                  <div style={{ display: "flex", gap: "1rem" }}>
                    <button onClick={() => { setEnrolling(false); setQrCodeDataUrl(null); setSecret(null); }} className={styles.btnSecondary}>
                      Cancel
                    </button>
                    <button onClick={handleVerify} disabled={verifying} className={styles.btnPrimary} style={{ opacity: verifying ? 0.6 : 1 }}>
                      {verifying ? "Verifying..." : "Verify & Enable"}
                    </button>
                  </div>
                </>
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "rgba(255,255,255,0.4)" }}>
                  <Loader2 size={18} /> Generating QR code...
                </div>
              )}
            </div>
          ) : (
            <>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.9rem", marginBottom: "1.5rem", maxWidth: "500px" }}>
                Add an extra layer of security to your account by requiring a verification code from an authenticator app at sign-in.
              </p>
              <button onClick={handleStartEnroll} className={styles.btnPrimary}>
                Enable Two-Factor Authentication
              </button>
            </>
          )}
        </div>

        {/* Appearance */}
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "20px", padding: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "1.5rem" }}>
            <Sun size={24} color="#f59e0b" />
            <h2 style={{ fontSize: "1.3rem", fontWeight: 600, margin: 0 }}>Appearance</h2>
          </div>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.9rem", marginBottom: "1.5rem", maxWidth: "500px" }}>
            Choose how Bohenix looks to you. Select a theme preference below.
          </p>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            {([
              { mode: "dark" as ThemeMode, icon: <Moon size={20} />, label: "Dark" },
              { mode: "light" as ThemeMode, icon: <Sun size={20} />, label: "Light" },
              { mode: "system" as ThemeMode, icon: <Monitor size={20} />, label: "System" },
            ]).map((opt) => (
              <button
                key={opt.mode}
                onClick={() => handleThemeChange(opt.mode)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "1rem 1.5rem",
                  borderRadius: "14px",
                  background: theme === opt.mode ? "rgba(123,45,255,0.12)" : "rgba(255,255,255,0.03)",
                  border: theme === opt.mode ? "1px solid #7B2DFF" : "1px solid rgba(255,255,255,0.08)",
                  color: theme === opt.mode ? "#fff" : "rgba(255,255,255,0.6)",
                  cursor: "pointer",
                  fontWeight: theme === opt.mode ? 700 : 500,
                  fontSize: "0.95rem",
                  transition: "all 0.2s",
                  minWidth: "130px",
                  fontFamily: "inherit",
                }}
              >
                {opt.icon}
                {opt.label}
                {theme === opt.mode && <CheckCircle2 size={16} color="#7B2DFF" style={{ marginLeft: "auto" }} />}
              </button>
            ))}
          </div>
        </div>

        {/* Billing & Subscription */}
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "20px", padding: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "1.5rem" }}>
            <CreditCard size={24} color="#f59e0b" />
            <h2 style={{ fontSize: "1.3rem", fontWeight: 600, margin: 0 }}>{t("settings.billing")}</h2>
          </div>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.9rem", marginBottom: "1.5rem", maxWidth: "500px" }}>
            {t("settings.billing_desc")}
          </p>

          {loadingSub ? (
            <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "rgba(255,255,255,0.4)" }}>
              <Loader2 size={18} /> Loading subscription...
            </div>
          ) : subData?.active ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "1rem", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: "12px", color: "#22c55e", fontWeight: 600 }}>
                <CheckCircle2 size={20} />
                Active Subscription — {subData.plan}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: "12px", padding: "1rem", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)", margin: "0 0 4px" }}>Status</p>
                  <p style={{ fontSize: "1rem", fontWeight: 600, color: "#22c55e", margin: 0, textTransform: "capitalize" }}>{subData.status}</p>
                </div>
                <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: "12px", padding: "1rem", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)", margin: "0 0 4px" }}>Renews On</p>
                  <p style={{ fontSize: "1rem", fontWeight: 600, margin: 0 }}>
                    {subData.currentPeriodEnd ? new Date(subData.currentPeriodEnd).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "1rem", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", color: "rgba(255,255,255,0.6)" }}>
                <CreditCard size={18} />
                No active subscription
              </div>
              <a href="/flow-ai" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "0.85rem 1.5rem", background: "#7B2DFF", color: "#fff", borderRadius: "12px", fontWeight: 600, fontSize: "0.95rem", textDecoration: "none", transition: "all 0.2s", width: "fit-content" }}>
                <CreditCard size={16} />
                Subscribe to Flow AI
              </a>
            </div>
          )}
        </div>

        {/* Language */}
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "20px", padding: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "1.5rem" }}>
            <Globe size={24} color="#00E5FF" />
            <h2 style={{ fontSize: "1.3rem", fontWeight: 600, margin: 0 }}>{t("settings.language")}</h2>
          </div>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.9rem", marginBottom: "1.5rem", maxWidth: "500px" }}>
            {t("settings.language_desc")}
          </p>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            {([
              { code: "en" as Language, label: "English", native: "English" },
              { code: "sw" as Language, label: "Kiswahili", native: "Kiswahili" },
            ]).map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "1rem 1.5rem",
                  borderRadius: "14px",
                  background: language === lang.code ? "rgba(0,229,255,0.08)" : "rgba(255,255,255,0.03)",
                  border: language === lang.code ? "1px solid #00E5FF" : "1px solid rgba(255,255,255,0.08)",
                  color: language === lang.code ? "#fff" : "rgba(255,255,255,0.6)",
                  cursor: "pointer",
                  fontWeight: language === lang.code ? 700 : 500,
                  fontSize: "0.95rem",
                  transition: "all 0.2s",
                  minWidth: "160px",
                  fontFamily: "inherit",
                }}
              >
                <span style={{ fontSize: "1.2rem" }}>{lang.code === "en" ? "🇬🇧" : "🇰🇪"}</span>
                <span>{lang.native}</span>
                {language === lang.code && <CheckCircle2 size={16} color="#00E5FF" style={{ marginLeft: "auto" }} />}
              </button>
            ))}
          </div>
        </div>

      </div>
    </>
  );
}
