"use client";

import React, { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment } from "@react-three/drei";
import * as THREE from "three";

function LogoShape() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.15;
      meshRef.current.rotation.x += delta * 0.05;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.15} floatIntensity={0.8}>
      <mesh ref={meshRef} castShadow receiveShadow>
        <torusKnotGeometry args={[1.5, 0.4, 256, 64]} />
        <meshStandardMaterial
          color="#e0e0e0"
          metalness={0.95}
          roughness={0.08}
          envMapIntensity={2.5}
        />
      </mesh>
    </Float>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" />
      <pointLight position={[-5, 0, 2]} intensity={80} color="#7B2DFF" distance={10} decay={2} />
      <pointLight position={[5, -5, -2]} intensity={60} color="#A855F7" distance={10} decay={2} />
      <LogoShape />
      <Environment preset="city" />
    </>
  );
}

export default function HeroLogo3D() {
  return (
    <div style={{ width: "100%", height: "550px", position: "relative" }}>
      <Suspense fallback={
        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 40, height: 40, border: "3px solid rgba(123,45,255,0.2)", borderTopColor: "#7B2DFF", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
        </div>
      }>
        <Canvas
          camera={{ position: [0, 0, 5], fov: 45 }}
          gl={{ antialias: true, alpha: true }}
          style={{ background: "transparent" }}
        >
          <Scene />
        </Canvas>
      </Suspense>
    </div>
  );
}
