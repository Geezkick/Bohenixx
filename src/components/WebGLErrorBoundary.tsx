"use client";

import React, { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * Error boundary that catches WebGL/THREE.js crashes
 * and renders a static fallback instead of crashing the entire page.
 */
export default class WebGLErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.warn("[Bohenix] WebGL component failed gracefully:", error.message);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div
            style={{
              height: "400px",
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "rgba(255,255,255,0.3)",
              fontSize: "0.85rem",
              background: "radial-gradient(circle at center, rgba(123, 45, 255, 0.08) 0%, transparent 60%)",
              borderRadius: "50%",
            }}
          >
            🌍 Globe visualization requires WebGL
          </div>
        )
      );
    }

    return this.props.children;
  }
}
