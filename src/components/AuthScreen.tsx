"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import ParticlesBackground from "@/components/ParticlesBackground";
import styles from "./AuthScreen.module.css";

type Mode = "login" | "signup" | "reset";

export default function AuthScreen() {
  const { login, signup, loginWithGoogle, resetPassword } = useAuth();
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
  const videoRef = useRef<HTMLVideoElement>(null);

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
        const result = await resetPassword(email);
        if (result.success) {
          setSuccessMsg("Password reset email sent! Check your inbox.");
        } else {
          setError(result.error || "Failed to send reset email. Try again.");
        }
      } catch {
        setError("Something went wrong. Try again.");
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!email || !password) {
      setError("Please fill in all fields");
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
            result.error || (mode === "login" ? "Invalid credentials" : "Error creating account")
          );
        }
      }
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");
    const res = await loginWithGoogle();
    if (!res.success) {
      setError(res.error || "Failed to initialize Google Sign-In");
      setLoading(false);
    }
    // If success, browser is redirected — loading stays true intentionally
  };

  const switchMode = (newMode: Mode) => {
    setMode(newMode);
    setError("");
    setSuccessMsg("");
    setName("");
    setPassword("");
    setRequiresTwoFactor(false);
    setTotpCode("");
  };

  // Deep storytelling phrases
  const adverts = [
    <>Architecting a <span className={styles.highlight}>Cognitive Tech-Ecosystem</span> to <span className={styles.highlightWarm}>autonomously scale</span> <span className={styles.highlight}>Africa&apos;s Digital Infrastructure</span>.</>,
    <><span className={styles.highlightWarm}>Engineering</span> <span className={styles.highlight}>Hyper-Converged Solutions</span> that seamlessly fuse <span className={styles.highlight}>Predictive AI</span> with <span className={styles.highlightWarm}>resilient enterprise</span> security.</>,
    <>Bohenix Flow AI: The <span className={styles.highlightWarm}>centralized nexus</span> for <span className={styles.highlight}>Intelligent Automation</span>.</>,
    <>Pioneering the <span className={styles.highlightWarm}>next epoch</span> of <span className={styles.highlight}>Cyber-Physical Systems</span> to drive <span className={styles.highlight}>Exponential Economic Velocity</span>.</>,
  ];
  const [adIndex, setAdIndex] = useState(0);

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
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setAdIndex((prev) => (prev + 1) % adverts.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const modeConfig = {
    login: {
      title: "Access your enterprise portal",
      submitLabel: "Authenticate",
      googleLabel: "Sign in with Google",
    },
    signup: {
      title: "Join the digital ecosystem",
      submitLabel: "Create Account",
      googleLabel: "Sign up with Google",
    },
    reset: {
      title: "Reset your password",
      submitLabel: "Send Reset Link",
      googleLabel: null,
    },
  };

  const current = modeConfig[mode];

  return (
    <div className={styles.screen}>
      {/* LEFT SIDE - Auth Form */}
      <div className={styles.leftSide}>
        <div style={{ position: "absolute", inset: 0, zIndex: 0, opacity: 0.3 }}>
          <ParticlesBackground />
        </div>
        <div className={styles.topGlow} />

        <div className={styles.content}>
          <div className={styles.logoArea}>
            <Image src="/bohenixx.png" alt="Bohenix" width={90} height={90} className={styles.logo} />
            <h1 className={styles.appName}>Bohenix</h1>
            <p className={styles.tagline}>{current.title}</p>
          </div>

          <div className={styles.form}>
            {/* Animated mode switcher tabs */}
            {mode !== "reset" && (
              <div className={styles.modeTabs}>
                <button
                  className={`${styles.modeTab} ${mode === "login" ? styles.modeTabActive : ""}`}
                  onClick={() => switchMode("login")}
                >
                  Sign In
                </button>
                <button
                  className={`${styles.modeTab} ${mode === "signup" ? styles.modeTabActive : ""}`}
                  onClick={() => switchMode("signup")}
                >
                  Create Account
                </button>
              </div>
            )}

            {mode === "signup" && (
              <div className={styles.inputGroup}>
                <label className={styles.label}>Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className={styles.input}
                  autoComplete="name"
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                />
              </div>
            )}

            <div className={styles.inputGroup}>
              <label className={styles.label}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className={styles.input}
                autoComplete="email"
                onKeyDown={(e) => e.key === "Enter" && mode === "reset" && handleSubmit()}
              />
            </div>

            {mode !== "reset" && (
              <div className={styles.inputGroup}>
                <label className={styles.label}>Password</label>
                <div className={styles.passwordWrap}>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={styles.input}
                    autoComplete={mode === "login" ? "current-password" : "new-password"}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  />
                  <button
                    type="button"
                    className={styles.eyeBtn}
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
            )}

            {requiresTwoFactor && (
              <div className={styles.inputGroup}>
                <label className={styles.label}>Authentication Code</label>
                <input
                  type="text"
                  inputMode="numeric"
                  autoFocus
                  value={totpCode}
                  onChange={(e) => setTotpCode(e.target.value)}
                  placeholder="6-digit code or backup code"
                  className={styles.input}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                />
              </div>
            )}

            {/* Password strength indicator for signup */}
            {mode === "signup" && password.length > 0 && (
              <div className={styles.strengthBar}>
                <div
                  className={styles.strengthFill}
                  style={{
                    width: `${Math.min(100, (password.length / 12) * 100)}%`,
                    background:
                      password.length < 8
                        ? "#ef4444"
                        : password.length < 10
                        ? "#f59e0b"
                        : "#22c55e",
                  }}
                />
                <span className={styles.strengthLabel}>
                  {password.length < 8 ? "Weak" : password.length < 10 ? "Fair" : "Strong"}
                </span>
              </div>
            )}

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className={styles.error}
              >
                {error}
              </motion.p>
            )}

            {successMsg && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className={styles.success}
              >
                {successMsg}
              </motion.p>
            )}

            <button
              className={styles.submitBtn}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? <span className={styles.spinner} /> : current.submitLabel}
            </button>

            {mode !== "reset" && (
              <>
                <div className={styles.divider}>
                  <div className={styles.dividerLine} />
                  <span className={styles.dividerText}>OR</span>
                  <div className={styles.dividerLine} />
                </div>

                <button
                  id="google-signin-btn"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className={styles.googleBtn}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  {current.googleLabel}
                </button>
              </>
            )}

            {/* Footer links */}
            <div className={styles.footerLinks}>
              {mode === "login" && (
                <button
                  className={styles.forgotBtn}
                  onClick={() => switchMode("reset")}
                >
                  Forgot password?
                </button>
              )}
              {mode === "reset" && (
                <button
                  className={styles.forgotBtn}
                  onClick={() => switchMode("login")}
                >
                  ← Back to Sign In
                </button>
              )}
            </div>
          </div>

          <div className={styles.toggle}>
            {mode !== "reset" && (
              <>
                <span className={styles.toggleText}>
                  {mode === "login" ? "Don't have an account?" : "Already have an account?"}
                </span>
                <button
                  className={styles.toggleBtn}
                  onClick={() => switchMode(mode === "login" ? "signup" : "login")}
                >
                  {mode === "login" ? "Request Access" : "Sign In"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - Looping Video & Animated Text */}
      <div className={styles.rightSide}>
        <video
          ref={videoRef}
          src="/bohenixx.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className={styles.videoPlayer}
        />
        <div className={styles.overlayTextWrap}>
          <AnimatePresence mode="wait">
            <motion.h2
              key={adIndex}
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 1.02 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className={styles.advertText}
            >
              {adverts[adIndex]}
            </motion.h2>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
