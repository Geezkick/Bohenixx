"use client";

import React, { useEffect, useRef, useState } from "react";
import createGlobe from "cobe";
import ErrorBoundary from "./ErrorBoundary";

function GlobeInner() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [width, setWidth] = useState(600);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 600) {
        setWidth(window.innerWidth - 40);
      } else {
        setWidth(600);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    let phi = 0;
    if (!canvasRef.current) return;

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi: 0,
      theta: 0.2,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.1, 0.1, 0.1],
      markerColor: [0.48, 0.17, 1], // #7B2DFF equivalent
      glowColor: [0.05, 0.05, 0.05],
      markers: [
        { location: [-1.2921, 36.8219], size: 0.05 }, // Nairobi
        { location: [6.5244, 3.3792], size: 0.05 },   // Lagos
        { location: [-26.2041, 28.0473], size: 0.05 },// Johannesburg
        { location: [-1.9403, 30.0599], size: 0.04 }, // Kigali
        { location: [30.0444, 31.2357], size: 0.04 }, // Cairo
        { location: [-6.7924, 39.2083], size: 0.04 }, // Dar es Salaam
        { location: [9.0192, 38.7525], size: 0.04 },  // Addis Ababa
        { location: [5.6037, -0.1870], size: 0.04 },  // Accra
      ],
      onRender: (state) => {
        state.phi = phi;
        phi += 0.005;
      }
    });

    return () => {
      globe.destroy();
    };
  }, [width]);

  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ width, height: width, position: 'relative' }}>
        <canvas
          ref={canvasRef}
          style={{ width: '100%', height: '100%', cursor: 'grab', contain: 'layout paint size' }}
        />
      </div>
    </div>
  );
}

export default function RealGlobe() {
  return (
    <ErrorBoundary fallback={<div style={{ textAlign: 'center', color: '#B3B3B8' }}>Interactive Globe Unavailable</div>}>
      <GlobeInner />
    </ErrorBoundary>
  );
}
