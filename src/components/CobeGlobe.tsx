"use client";

import React, { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import ErrorBoundary from "./ErrorBoundary";

// Dynamically import react-globe.gl to avoid SSR issues with WebGL
const Globe = dynamic(() => import("react-globe.gl"), {
  ssr: false,
  loading: () => <GlobeFallback message="Loading Earth..." />,
});

function GlobeFallback({ message }: { message: string }) {
  return (
    <div style={{
      width: '100%',
      height: '400px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at center, rgba(123,45,255,0.08) 0%, transparent 70%)',
      borderRadius: '24px',
      border: '1px solid rgba(255,255,255,0.06)',
      gap: '1rem',
    }}>
      <div style={{
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(123,45,255,0.3) 0%, rgba(0,229,255,0.1) 60%, transparent 100%)',
        animation: 'pulse 2s ease-in-out infinite',
        boxShadow: '0 0 40px rgba(123,45,255,0.2)',
      }} />
      <span style={{ color: '#B3B3B8', fontSize: '14px', letterSpacing: '1px' }}>{message}</span>
      <style>{`@keyframes pulse { 0%, 100% { transform: scale(1); opacity: 0.7; } 50% { transform: scale(1.15); opacity: 1; } }`}</style>
    </div>
  );
}

function isWebGLAvailable(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl");
    return gl instanceof WebGLRenderingContext || gl instanceof WebGL2RenderingContext;
  } catch {
    return false;
  }
}

function GlobeInner() {
  const [windowWidth, setWindowWidth] = useState(600);
  const [mounted, setMounted] = useState(false);
  const [webglSupported, setWebglSupported] = useState(true);
  const globeEl = useRef<any>(null);

  useEffect(() => {
    setMounted(true);
    setWebglSupported(isWebGLAvailable());
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    
    // Auto-rotate the globe slowly
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 1;
    }
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const markerData = [
    { lat: -1.2921, lng: 36.8219, size: 0.1, color: '#00E5FF', name: 'Nairobi' },
    { lat: 6.5244, lng: 3.3792, size: 0.1, color: '#00E5FF', name: 'Lagos' },
    { lat: -26.2041, lng: 28.0473, size: 0.1, color: '#00E5FF', name: 'Johannesburg' },
    { lat: -1.9403, lng: 30.0599, size: 0.08, color: '#B14CFF', name: 'Kigali' },
    { lat: 30.0444, lng: 31.2357, size: 0.08, color: '#B14CFF', name: 'Cairo' },
    { lat: -6.7924, lng: 39.2083, size: 0.08, color: '#B14CFF', name: 'Dar es Salaam' },
    { lat: 9.0192, lng: 38.7525, size: 0.06, color: '#B14CFF', name: 'Addis Ababa' },
    { lat: 5.6037, lng: -0.1870, size: 0.06, color: '#B14CFF', name: 'Accra' },
  ];

  if (!mounted) {
    return <GlobeFallback message="Loading Earth..." />;
  }

  if (!webglSupported) {
    return <GlobeFallback message="3D Globe requires WebGL" />;
  }

  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px', cursor: 'grab' }}>
      <Globe
        ref={globeEl}
        width={Math.min(windowWidth - 40, 600)}
        height={Math.min(windowWidth - 40, 600)}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundColor="rgba(0,0,0,0)"
        pointsData={markerData}
        pointLat="lat"
        pointLng="lng"
        pointColor="color"
        pointAltitude={0.01}
        pointRadius={1.0}
        pointsMerge={false}
        labelsData={markerData}
        labelLat="lat"
        labelLng="lng"
        labelText="name"
        labelSize={1.2}
        labelDotRadius={0.3}
        labelColor={() => 'rgba(255, 255, 255, 0.8)'}
        labelResolution={2}
        onGlobeReady={() => {
          if (globeEl.current) {
            globeEl.current.controls().autoRotate = true;
            globeEl.current.controls().autoRotateSpeed = 1.5;
            // Point camera towards Africa
            globeEl.current.pointOfView({ lat: 0, lng: 20, altitude: 2.2 }, 2000);
          }
        }}
      />
    </div>
  );
}

export default function RealGlobe() {
  return (
    <ErrorBoundary fallback={<GlobeFallback message="3D Globe unavailable" />}>
      <GlobeInner />
    </ErrorBoundary>
  );
}
