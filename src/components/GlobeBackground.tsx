"use client";

import React, { useEffect, useState } from 'react';
import styles from './GlobeBackground.module.css';

export default function GlobeBackground() {
  const [nodes, setNodes] = useState<{ id: number, top: string, left: string, delay: string, size: string }[]>([]);

  useEffect(() => {
    // Generate nodes only on the client to avoid hydration mismatches
    const generatedNodes = [...Array(30)].map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`,
      size: `${Math.random() * 4 + 2}px`,
    }));
    setNodes(generatedNodes);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.globeGlow} />
      <div className={styles.globeCore} />
      <div className={styles.networkNodes}>
        {nodes.map((node) => (
          <div 
            key={node.id} 
            className={styles.node} 
            style={{
              top: node.top,
              left: node.left,
              animationDelay: node.delay,
              width: node.size,
              height: node.size,
            }} 
          />
        ))}
      </div>
    </div>
  );
}
