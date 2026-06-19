"use client";

import { useState } from "react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
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
      const success = mode === "login"
        ? await login(email, password)
        : await signup(name, email, password);

      if (!success) {
        setError(mode === "login" ? "Invalid credentials" : "Password must be 6+ characters");
      }
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.screen}>
      {/* Top gradient decoration */}
      <div className={styles.topGlow} />

      <div className={styles.content}>
        {/* Logo + Welcome */}
        <div className={styles.logoArea}>
          <Image src="/bohenixx.png" alt="Bohenix" width={72} height={72} className={styles.logo} />
          <h1 className={styles.appName}>Bohenix ONE</h1>
          <p className={styles.tagline}>
            {mode === "login" ? "Welcome back" : "Create your account"}
          </p>
        </div>

        {/* Form */}
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
              mode === "login" ? "Sign In" : "Create Account"
            )}
          </button>

          {mode === "login" && (
            <button className={styles.forgotBtn}>Forgot password?</button>
          )}
        </div>

        {/* Toggle */}
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
            {mode === "login" ? "Sign Up" : "Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
}
