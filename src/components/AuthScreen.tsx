"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import ParticlesBackground from "@/components/ParticlesBackground";
import styles from "./AuthScreen.module.css";

export default function AuthScreen() {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async () => {
    setError("");
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    if (mode === "signup" && !name) {
      setError("Please enter your name");
      return;
    }

    setLoading(true);
    try {
      const result = mode === "login"
        ? await login(email, password)
        : await signup(name, email, password);

      if (!result.success) {
        setError(result.error || (mode === "login" ? "Invalid credentials" : "Error creating account"));
      }
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Deep storytelling phrases with balanced gradient highlights
  const adverts = [
    <>Architecting a <span className={styles.highlight}>Cognitive Tech-Ecosystem</span> to autonomously scale <span className={styles.highlight}>Africa's Digital Infrastructure</span>.</>,
    <>Engineering <span className={styles.highlight}>Hyper-Converged Solutions</span> that seamlessly fuse <span className={styles.highlight}>Predictive AI</span> with resilient enterprise security.</>,
    <>Bohenix ONE: The centralized nexus for <span className={styles.highlight}>Quantum-Resistant Networks</span> and <span className={styles.highlight}>Intelligent Automation</span>.</>,
    <>Pioneering the next epoch of <span className={styles.highlight}>Cyber-Physical Systems</span> to drive <span className={styles.highlight}>Exponential Economic Velocity</span>.</>
  ];
  const [adIndex, setAdIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAdIndex((prev) => (prev + 1) % adverts.length);
    }, 6000); // 6 seconds for longer reading time
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.screen}>
      {/* LEFT SIDE - Auth Form */}
      <div className={styles.leftSide}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, opacity: 0.3 }}>
          <ParticlesBackground />
        </div>
        <div className={styles.topGlow} />

        <div className={styles.content}>
          <div className={styles.logoArea}>
            <Image src="/bohenixx.png" alt="Bohenix" width={90} height={90} className={styles.logo} />
            <h1 className={styles.appName}>Bohenix ONE</h1>
            <p className={styles.tagline}>
              {mode === "login" ? "Access your enterprise portal" : "Join the digital ecosystem"}
            </p>
          </div>

          <div className={styles.form}>
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
              />
            </div>

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
                />
                <button
                  type="button"
                  className={styles.eyeBtn}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {error && <p className={styles.error}>{error}</p>}

            <button
              className={styles.submitBtn}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <span className={styles.spinner} />
              ) : (
                mode === "login" ? "Authenticate" : "Create Account"
              )}
            </button>

            {mode === "login" && (
              <button className={styles.forgotBtn}>Forgot password?</button>
            )}
          </div>

          <div className={styles.toggle}>
            <span className={styles.toggleText}>
              {mode === "login" ? "Don't have an account?" : "Already have an account?"}
            </span>
            <button
              className={styles.toggleBtn}
              onClick={() => {
                setMode(mode === "login" ? "signup" : "login");
                setError("");
              }}
            >
              {mode === "login" ? "Request Access" : "Sign In"}
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - Looping Video & Animated Text */}
      <div className={styles.rightSide}>
        <video 
          ref={(el) => {
            if (el) {
              el.play().catch(e => console.error("Autoplay prevented:", e));
            }
          }}
          src="/bohenixx.mp4" 
          autoPlay 
          loop 
          muted 
          playsInline 
          preload="auto"
          className={styles.videoPlayer}
        >
          <source src="/bohenixx.mp4" type="video/mp4" />
        </video>
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
