"use client";

import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, PresentationControls, MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";

function LogoShape() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.15; // Slow rotation
      meshRef.current.rotation.x += delta * 0.05;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={1}>
      <mesh ref={meshRef} castShadow receiveShadow>
        {/* An elegant, complex geometric shape to represent the brand */}
        <torusKnotGeometry args={[1.5, 0.4, 256, 64]} />
        <MeshTransmissionMaterial
          backside
          backsideThickness={1}
          thickness={1.5}
          anisotropicBlur={0.1}
          clearcoat={1}
          clearcoatRoughness={0.1}
          envMapIntensity={2}
          color="#ffffff"
          metalness={0.9}
          roughness={0.1}
          transmission={0.2}
          ior={1.5}
        />
      </mesh>
    </Float>
  );
}

export default function HeroLogo3D() {
  return (
    <div style={{ width: "100%", height: "600px", position: "relative", pointerEvents: "auto" }}>
      <Canvas
        shadows
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={2} color="#ffffff" castShadow />
        
        {/* Purple Emissive Lighting for the Apple/NVIDIA vibe */}
        <pointLight position={[-5, 0, 2]} intensity={100} color="#7B2DFF" distance={10} decay={2} />
        <pointLight position={[5, -5, -2]} intensity={80} color="#A855F7" distance={10} decay={2} />
        
        <PresentationControls
          global
          config={{ mass: 2, tension: 500 }}
          snap={{ mass: 4, tension: 1500 }}
          rotation={[0, 0.3, 0]}
          polar={[-Math.PI / 3, Math.PI / 3]}
          azimuth={[-Math.PI / 1.4, Math.PI / 2]}
        >
          <LogoShape />
        </PresentationControls>
        
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
