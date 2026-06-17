"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, Float, MeshDistortMaterial, Sphere, Box } from "@react-three/drei";
import * as THREE from "three";

interface ThreeDPreviewProps {
  color: string;
  type: "robot" | "drone" | "ev";
}

function AbstractModel({ color, type }: ThreeDPreviewProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
      meshRef.current.rotation.x += delta * 0.2;
    }
  });

  if (type === "ev") {
    return (
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <Box ref={meshRef} args={[2.5, 0.8, 1.2]}>
          <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
        </Box>
        {/* Wheels placeholder */}
        <Sphere args={[0.3, 32, 32]} position={[-1, -0.4, 0.6]}>
          <meshStandardMaterial color="#111" metalness={0.5} roughness={0.8} />
        </Sphere>
        <Sphere args={[0.3, 32, 32]} position={[1, -0.4, 0.6]}>
          <meshStandardMaterial color="#111" metalness={0.5} roughness={0.8} />
        </Sphere>
        <Sphere args={[0.3, 32, 32]} position={[-1, -0.4, -0.6]}>
          <meshStandardMaterial color="#111" metalness={0.5} roughness={0.8} />
        </Sphere>
        <Sphere args={[0.3, 32, 32]} position={[1, -0.4, -0.6]}>
          <meshStandardMaterial color="#111" metalness={0.5} roughness={0.8} />
        </Sphere>
      </Float>
    );
  }

  if (type === "drone") {
    return (
      <Float speed={4} rotationIntensity={1} floatIntensity={2}>
        <Box ref={meshRef} args={[1.5, 0.2, 1.5]}>
          <meshStandardMaterial color={color} metalness={0.9} roughness={0.1} />
        </Box>
        {/* Rotors */}
        <Sphere args={[0.2, 16, 16]} position={[-0.75, 0.1, -0.75]}>
          <meshStandardMaterial color="#fff" wireframe />
        </Sphere>
        <Sphere args={[0.2, 16, 16]} position={[0.75, 0.1, 0.75]}>
          <meshStandardMaterial color="#fff" wireframe />
        </Sphere>
        <Sphere args={[0.2, 16, 16]} position={[-0.75, 0.1, 0.75]}>
          <meshStandardMaterial color="#fff" wireframe />
        </Sphere>
        <Sphere args={[0.2, 16, 16]} position={[0.75, 0.1, -0.75]}>
          <meshStandardMaterial color="#fff" wireframe />
        </Sphere>
      </Float>
    );
  }

  // Default / Robot: An abstract distorting sphere
  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1}>
      <Sphere ref={meshRef} args={[1, 64, 64]}>
        <MeshDistortMaterial
          color={color}
          envMapIntensity={1}
          clearcoat={1}
          clearcoatRoughness={0}
          metalness={0.9}
          roughness={0.1}
          distort={0.4}
          speed={2}
        />
      </Sphere>
    </Float>
  );
}

export default function ThreeDPreview({ color, type }: ThreeDPreviewProps) {
  return (
    <div style={{ width: "100%", height: "100%", position: "relative", cursor: "grab" }}>
      <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} color={color} />
        
        <AbstractModel color={color} type={type} />
        
        <OrbitControls enableZoom={false} autoRotate={false} />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
