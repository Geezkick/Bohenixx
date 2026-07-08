"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

export default function CobeGlobe() {
  const containerRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<any>(null);
  const [dimensions, setDimensions] = useState({ width: 600, height: 600 });
  const [mounted, setMounted] = useState(false);

  const markerData = [
    { lat: -1.2921, lng: 36.8219 }, // Nairobi
    { lat: 6.5244, lng: 3.3792 },   // Lagos
    { lat: -26.2041, lng: 28.0473 },// Johannesburg
    { lat: -1.9403, lng: 30.0599 }, // Kigali
    { lat: 30.0444, lng: 31.2357 }, // Cairo
    { lat: -6.7924, lng: 39.2083 }, // Dar es Salaam
    { lat: 9.0192, lng: 38.7525 },  // Addis Ababa
    { lat: 5.6037, lng: -0.187 },   // Accra
  ];

  useEffect(() => {
    setMounted(true);
    
    if (containerRef.current) {
      const { clientWidth } = containerRef.current;
      setDimensions({ width: clientWidth, height: clientWidth });
    }
    
    const handleResize = () => {
      if (containerRef.current) {
        const { clientWidth } = containerRef.current;
        setDimensions({ width: clientWidth, height: clientWidth });
      }
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (globeRef.current && mounted) {
      const controls = globeRef.current.controls();
      if (controls) {
        controls.autoRotate = true;
        controls.autoRotateSpeed = 1.0;
        controls.enableZoom = false; // Disable zoom to not interfere with page scrolling
      }
    }
  }, [mounted, globeRef.current]);

  return (
    <div 
      ref={containerRef}
      style={{
        width: "100%",
        maxWidth: 600,
        aspectRatio: "1 / 1",
        margin: "0 auto",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "grab",
      }}
    >
      {mounted && (
        <Globe
          ref={globeRef}
          width={dimensions.width}
          height={dimensions.height}
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
          bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
          backgroundColor="rgba(0,0,0,0)"
          
          ringsData={markerData}
          ringColor={() => "#7a2cff"}
          ringMaxRadius={3}
          ringPropagationSpeed={2}
          ringRepeatPeriod={1000}
          
          pointsData={markerData}
          pointColor={() => "#ffffff"}
          pointAltitude={0.01}
          pointRadius={0.4}
          pointsMerge={true}
        />
      )}
    </div>
  );
}
