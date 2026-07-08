"use client";

import React, { useEffect, useRef, useCallback } from "react";

export default function CobeGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const globeRef = useRef<any>(null);
  const phiRef = useRef(0);

  const initGlobe = useCallback(async () => {
    if (!canvasRef.current) return;
    
    // Destroy previous instance if exists
    if (globeRef.current) {
      globeRef.current.destroy();
      globeRef.current = null;
    }

    try {
      const cobe = await import("cobe");
      const createGlobe = cobe.default;
      
      if (!canvasRef.current) return;

      const size = Math.min(window.innerWidth - 40, 600);

      globeRef.current = createGlobe(canvasRef.current, {
        devicePixelRatio: 2,
        width: size * 2,
        height: size * 2,
        phi: 0,
        theta: 0.2,
        dark: 1,
        diffuse: 1.2,
        mapSamples: 16000,
        mapBrightness: 6,
        baseColor: [1, 1, 1],
        markerColor: [0.48, 0.17, 1],
        glowColor: [0.2, 0.2, 0.2],
        markers: [
          { location: [-1.2921, 36.8219], size: 0.05 },
          { location: [6.5244, 3.3792], size: 0.05 },
          { location: [-26.2041, 28.0473], size: 0.05 },
          { location: [-1.9403, 30.0599], size: 0.04 },
          { location: [30.0444, 31.2357], size: 0.04 },
          { location: [-6.7924, 39.2083], size: 0.04 },
          { location: [9.0192, 38.7525], size: 0.04 },
          { location: [5.6037, -0.187], size: 0.04 },
        ],
        // @ts-ignore
        onRender: (state: any) => {
          state.phi = phiRef.current;
          phiRef.current += 0.005;
        },
      });
    } catch (err) {
      console.error("Failed to initialize globe:", err);
    }
  }, []);

  useEffect(() => {
    // Small delay to ensure the canvas is fully mounted and has dimensions
    const timer = setTimeout(() => {
      initGlobe();
    }, 100);

    return () => {
      clearTimeout(timer);
      if (globeRef.current) {
        globeRef.current.destroy();
        globeRef.current = null;
      }
    };
  }, [initGlobe]);

  return (
    <div style={{
      width: "100%",
      maxWidth: 600,
      aspectRatio: "1 / 1",
      margin: "0 auto",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}>
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
          cursor: "grab",
        }}
      />
    </div>
  );
}
