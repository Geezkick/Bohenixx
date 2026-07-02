"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeftIcon,
  MailIcon,
  LockIcon,
  UserIcon,
  EyeIcon,
  EyeOffIcon,
  ShieldCheckIcon,
  LoaderIcon,
} from "lucide-react";
import styles from "./sign-in.module.css";

type Mode = "login" | "signup" | "reset";

const adverts = [
  {
    text: "Architecting a",
    hl: "Cognitive Tech-Ecosystem",
    mid: "to",
    warm: "autonomously scale",
    end: "Africa's Digital Infrastructure.",
  },
  {
    text: "Engineering",
    warm: "Hyper-Converged Solutions",
    mid: "that fuse",
    hl: "Predictive AI",
    end: "with resilient enterprise security.",
  },
  {
    text: "Bohenix ONE: The",
    warm: "centralized nexus",
    mid: "for",
    hl: "Quantum-Resistant Networks",
    end: "and Intelligent Automation.",
  },
  {
    text: "Pioneering the",
    warm: "next epoch",
    mid: "of",
    hl: "Cyber-Physical Systems",
    end: "to drive Exponential Economic Velocity.",
  },
];

export default function SignInPage() {
  const { user, isLoading: authLoading, login, signup, loginWithGoogle, resetPassword } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [requiresTwoFactor, setRequiresTwoFactor] = useState(false);
  const [totpCode, setTotpCode] = useState("");
  const [adIndex, setAdIndex] = useState(0);
  const [splashProgress, setSplashProgress] = useState(0);
  const [splashText, setSplashText] = useState("Initializing...");
  const [splashDone, setSplashDone] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  /* Splash loading sequence */
  useEffect(() => {
    const stages = [
      { at: 0, text: "Initializing..." },
      { at: 20, text: "Connecting to secure network..." },
      { at: 45, text: "Verifying session..." },
      { at: 70, text: "Loading portal..." },
      { at: 90, text: "Almost ready..." },
      { at: 100, text: "Welcome to Bohenix ONE" },
    ];

    const interval = setInterval(() => {
      setSplashProgress((prev) => {
        const next = Math.min(100, prev + 2);
        const stage = [...stages].reverse().find((s) => next >= s.at);
        if (stage) setSplashText(stage.text);
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => setSplashDone(true), 600);
        }
        return next;
      });
    }, 30);

    return () => clearInterval(interval);
  }, []);

  /* Redirect if already signed in (after splash) */
  useEffect(() => {
    if (splashDone && !authLoading && user) {
      router.replace("/dashboard");
    }
  }, [splashDone, authLoading, user, router]);

  /* Auto-play video */
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.muted = true;
    const playPromise = vid.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        setTimeout(() => vid.play().catch(() => {}), 500);
      });
    }
  }, [splashDone]);

  /* Cycle adverts */
  useEffect(() => {
    const interval = setInterval(() => {
      setAdIndex((p) => (p + 1) % adverts.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  /* Switch mode */
  const switchMode = (m: Mode) => {
    setMode(m);
    setError("");
    setSuccessMsg("");
    setName("");
    setPassword("");
    setRequiresTwoFactor(false);
    setTotpCode("");
  };

  /* Submit */
  const handleSubmit = async () => {
    setError("");
    setSuccessMsg("");

    if (mode === "reset") {
      if (!email) {
        setError("Please enter your email address");
        return;
      }
      setLoading(true);
      try {
        const res = await resetPassword(email);
        if (res.success) {
          setSuccessMsg("Password reset email sent! Check your inbox.");
        } else {
          setError(res.error || "Failed to send reset email.");
        }
      } catch {
        setError("Something went wrong. Try again.");
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!email || !password) {
      setError("Please fill in all required fields");
      return;
    }
    if (mode === "signup" && !name) {
      setError("Please enter your full name");
      return;
    }
    if (mode === "signup" && password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      const result =
        mode === "login"
          ? await login(email, password, requiresTwoFactor ? totpCode : undefined)
          : await signup(name, email, password);

      if (!result.success) {
        if (result.requiresTwoFactor) {
          setRequiresTwoFactor(true);
          if (result.error) setError(result.error);
        } else {
          setError(
            result.error ||
              (mode === "login" ? "Invalid credentials" : "Error creating account")
          );
        }
      }
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  /* Google */
  const handleGoogle = async () => {
    setLoading(true);
    setError("");
    const res = await loginWithGoogle();
    if (!res.success) {
      setError(res.error || "Failed to initialize Google Sign-In");
      setLoading(false);
    }
  };

  /* Password strength */
  const getStrength = () => {
    const len = password.length;
    if (len === 0) return { pct: 0, label: "", color: "transparent" };
    if (len < 8) return { pct: (len / 12) * 100, label: "Weak", color: "#ef4444" };
    if (len < 10) return { pct: (len / 12) * 100, label: "Fair", color: "#f59e0b" };
    return { pct: Math.min(100, (len / 12) * 100), label: "Strong", color: "#22c55e" };
  };
  const strength = getStrength();

  /* Mode config */
  const config = {
    login: { heading: "Sign In", submitLabel: "Authenticate", googleLabel: "Continue with Google" },
    signup: { heading: "Create Account", submitLabel: "Create Account", googleLabel: "Sign up with Google" },
    reset: { heading: "Reset Password", submitLabel: "Send Reset Link", googleLabel: "" },
  };
  const cur = config[mode];
  const ad = adverts[adIndex];

  return (
    <div className={styles.page}>
      {/* ═══ Splash / Loading Screen ═══ */}
      {!splashDone && (
        <div className={styles.splash}>
          <div className={styles.splashContent}>
            <div className={styles.splashLogoWrap}>
              <Image
                src="/bohenixx.png"
                alt="Bohenix"
                width={80}
                height={80}
                className={styles.splashLogo}
                priority
              />
            </div>
            <h1 className={styles.splashTitle}>
              BOHENIX <span className={styles.splashGradient}>ONE</span>
            </h1>
            <p className={styles.splashStatus}>{splashText}</p>
            <div className={styles.splashTrack}>
              <div
                className={styles.splashFill}
                style={{ width: `${splashProgress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ═══ Main Sign-In Page (only after splash) ═══ */}
      {splashDone && (
      <>
      {/* Full-screen video background */}
      <div className={styles.videoBg}>
        <video
          ref={videoRef}
          src="/bohenixx.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        />
        <div className={styles.videoOverlay} />
      </div>

      {/* Back to home */}
      <Link href="/" className={styles.backLink}>
        <ArrowLeftIcon size={15} /> Back to Home
      </Link>

      {/* Main card */}
      <div className={styles.container}>
        <div className={styles.card}>
          {/* Branding */}
          <div className={styles.branding}>
            <div className={styles.logoWrap}>
              <div className={styles.logoGlow} />
              <Image
                src="/bohenixx.png"
                alt="Bohenix"
                width={72}
                height={72}
                className={styles.logo}
                priority
              />
            </div>
            <h1 className={styles.brandName}>Bohenix ONE</h1>
            <p className={styles.brandTagline}>
              {mode === "reset"
                ? "Enter your email to reset your password"
                : mode === "signup"
                ? "Join the digital ecosystem"
                : "Access your portal"}
            </p>
          </div>

          {/* Tabs — only show when not in reset mode */}
          {mode !== "reset" && (
            <div className={styles.tabs}>
              <button
                className={`${styles.tab} ${mode === "login" ? styles.tabActive : ""}`}
                onClick={() => switchMode("login")}
                type="button"
              >
                Sign In
              </button>
              <button
                className={`${styles.tab} ${mode === "signup" ? styles.tabActive : ""}`}
                onClick={() => switchMode("signup")}
                type="button"
              >
                Create Account
              </button>
            </div>
          )}

          {/* Form */}
          <div className={styles.form}>
            {/* Name field (signup only) */}
            {mode === "signup" && (
              <div className={styles.field}>
                <label className={styles.label}>Full Name</label>
                <div className={styles.inputWrap}>
                  <span className={styles.inputIcon}>
                    <UserIcon size={16} />
                  </span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className={styles.input}
                    autoComplete="name"
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                    id="signin-name"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div className={styles.field}>
              <label className={styles.label}>Email</label>
              <div className={styles.inputWrap}>
                <span className={styles.inputIcon}>
                  <MailIcon size={16} />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  className={styles.input}
                  autoComplete="email"
                  onKeyDown={(e) => e.key === "Enter" && mode === "reset" && handleSubmit()}
                  id="signin-email"
                />
              </div>
            </div>

            {/* Password */}
            {mode !== "reset" && (
              <div className={styles.field}>
                <label className={styles.label}>Password</label>
                <div className={styles.inputWrap}>
                  <span className={styles.inputIcon}>
                    <LockIcon size={16} />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={styles.input}
                    autoComplete={mode === "login" ? "current-password" : "new-password"}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                    id="signin-password"
                  />
                  <button
                    type="button"
                    className={styles.eyeToggle}
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                  </button>
                </div>
              </div>
            )}

            {/* Password strength (signup) */}
            {mode === "signup" && password.length > 0 && (
              <div className={styles.strengthWrap}>
                <div className={styles.strengthTrack}>
                  <div
                    className={styles.strengthBar}
                    style={{ width: `${strength.pct}%`, background: strength.color }}
                  />
                </div>
                <span className={styles.strengthText}>{strength.label}</span>
              </div>
            )}

            {/* 2FA code */}
            {requiresTwoFactor && (
              <div className={styles.field}>
                <label className={styles.label}>Authentication Code</label>
                <div className={styles.inputWrap}>
                  <span className={styles.inputIcon}>
                    <ShieldCheckIcon size={16} />
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    autoFocus
                    value={totpCode}
                    onChange={(e) => setTotpCode(e.target.value)}
                    placeholder="6-digit code or backup code"
                    className={styles.input}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                    id="signin-totp"
                  />
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className={styles.errorMsg}
              >
                {error}
              </motion.p>
            )}

            {/* Success */}
            {successMsg && (
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className={styles.successMsg}
              >
                {successMsg}
              </motion.p>
            )}

            {/* Submit */}
            <button
              className={styles.submitBtn}
              onClick={handleSubmit}
              disabled={loading}
              type="button"
              id="signin-submit"
            >
              {loading ? <span className={styles.spinner} /> : cur.submitLabel}
            </button>

            {/* Google + divider */}
            {mode !== "reset" && (
              <>
                <div className={styles.divider}>
                  <div className={styles.dividerLine} />
                  <span className={styles.dividerLabel}>or</span>
                  <div className={styles.dividerLine} />
                </div>

                <button
                  id="google-signin-btn"
                  onClick={handleGoogle}
                  disabled={loading}
                  className={styles.googleBtn}
                  type="button"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  {cur.googleLabel}
                </button>
              </>
            )}

            {/* Forgot password link */}
            {mode === "login" && (
              <div className={styles.forgotLink}>
                <button onClick={() => switchMode("reset")} type="button">
                  Forgot your password?
                </button>
              </div>
            )}

            {mode === "reset" && (
              <div className={styles.forgotLink}>
                <button onClick={() => switchMode("login")} type="button">
                  ← Back to Sign In
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Bottom toggle */}
        {mode !== "reset" && (
          <div className={styles.bottomToggle}>
            <span className={styles.bottomText}>
              {mode === "login" ? "Don't have an account?" : "Already have an account?"}
            </span>
            <button
              className={styles.bottomBtn}
              onClick={() => switchMode(mode === "login" ? "signup" : "login")}
              type="button"
            >
              {mode === "login" ? "Request Access" : "Sign In"}
            </button>
          </div>
        )}
      </div>

      {/* Animated advert bar at bottom */}
      <div className={styles.advertBar}>
        <AnimatePresence mode="wait">
          <motion.p
            key={adIndex}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={styles.advertText}
          >
            {ad.text}{" "}
            <span className={styles.advertHighlight}>{ad.hl}</span>{" "}
            {ad.mid}{" "}
            <span className={styles.advertWarm}>{ad.warm}</span>{" "}
            {ad.end}
          </motion.p>
        </AnimatePresence>
      </div>
      </>
      )}
    </div>
  );
}
