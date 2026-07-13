"use client";

import React, { useEffect, useState, useRef } from "react";
import Globe from "react-globe.gl";

const CITIES = [
  { name: "Nairobi", lat: -1.2921, lng: 36.8219, size: 0.1, color: "#7B2DFF" },
  { name: "Lagos", lat: 6.5244, lng: 3.3792, size: 0.1, color: "#00E5FF" },
  { name: "Johannesburg", lat: -26.2041, lng: 28.0473, size: 0.1, color: "#FF3366" },
  { name: "Kigali", lat: -1.9403, lng: 30.0588, size: 0.05, color: "#7B2DFF" },
  { name: "Cairo", lat: 30.0444, lng: 31.2357, size: 0.05, color: "#00E5FF" },
  { name: "Dar es Salaam", lat: -6.7924, lng: 39.2083, size: 0.05, color: "#7B2DFF" },
  { name: "Addis Ababa", lat: 9.0222, lng: 38.7468, size: 0.05, color: "#FF3366" },
  { name: "Accra", lat: 5.6037, lng: -0.1870, size: 0.05, color: "#00E5FF" },
  { name: "London", lat: 51.5074, lng: -0.1278, size: 0.05, color: "#fff" },
  { name: "New York", lat: 40.7128, lng: -74.0060, size: 0.05, color: "#fff" },
  { name: "Dubai", lat: 25.2048, lng: 55.2708, size: 0.05, color: "#fff" }
];

const ARCS = CITIES.filter(c => c.name !== "Nairobi").map(city => ({
  startLat: -1.2921,
  startLng: 36.8219,
  endLat: city.lat,
  endLng: city.lng,
  color: [city.color, "#7B2DFF"]
}));

export default function CobeGlobe() {
  const [mounted, setMounted] = useState(false);
  const globeEl = useRef<any>();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleGlobeReady = () => {
    if (globeEl.current) {
      const controls = globeEl.current.controls();
      if (controls) {
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.5;
      }
      try {
        globeEl.current.pointOfView({ lat: 0, lng: 20, altitude: 2 }, 1000);
      } catch(e) {}
    }
  };

  if (!mounted) return <div style={{ height: "400px", width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading Globe...</div>;

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "400px", cursor: "grab", overflow: "hidden", borderRadius: "50%", background: "radial-gradient(circle at center, rgba(123, 45, 255, 0.15) 0%, transparent 60%)" }}>
      <Globe
        ref={globeEl}
        onGlobeReady={handleGlobeReady}
        width={450}
        height={450}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundColor="rgba(0,0,0,0)"
        
        pointsData={CITIES}
        pointLat="lat"
        pointLng="lng"
        pointColor="color"
        pointAltitude={0.01}
        pointRadius="size"
        pointsMerge={false}
        
        arcsData={ARCS}
        arcStartLat="startLat"
        arcStartLng="startLng"
        arcEndLat="endLat"
        arcEndLng="endLng"
        arcColor="color"
        arcDashLength={0.4}
        arcDashGap={0.2}
        arcDashAnimateTime={2000}
        arcAltitudeAutoScale={0.3}
      />
    </div>
  );
}
