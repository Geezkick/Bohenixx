"use client";

import React, { useEffect, useState, useRef } from "react";
import styles from "./graph.module.css";
import { Activity, Network, Building2, User, FileText, BookOpen, Lightbulb, ArrowRight } from "lucide-react";

interface GraphNode {
  id: string;
  nodeType: string;
  label: string;
  properties?: string;
}

interface GraphEdge {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  relationType: string;
}

const NODE_COLORS: Record<string, string> = {
  DEPARTMENT: "rgba(123, 45, 255, 0.4)",
  AGENT: "rgba(34, 197, 94, 0.4)",
  CUSTOMER: "rgba(0, 229, 255, 0.4)",
  INVOICE: "rgba(255, 189, 46, 0.4)",
  DOCUMENT: "rgba(255, 95, 86, 0.4)",
  CONCEPT: "rgba(168, 85, 247, 0.4)",
};

const NODE_ICONS: Record<string, React.ReactNode> = {
  DEPARTMENT: <Building2 size={14} />,
  AGENT: <User size={14} />,
  CUSTOMER: <User size={14} />,
  INVOICE: <FileText size={14} />,
  DOCUMENT: <BookOpen size={14} />,
  CONCEPT: <Lightbulb size={14} />,
};

export default function KnowledgeGraphPage() {
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [edges, setEdges] = useState<GraphEdge[]>([]);
  const [stats, setStats] = useState({ totalNodes: 0, totalEdges: 0, nodeTypes: [] as string[] });
  const [loading, setLoading] = useState(true);
  const [nodePositions, setNodePositions] = useState<Record<string, { x: number; y: number }>>({});
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchGraph();
  }, []);

  async function fetchGraph() {
    try {
      const res = await fetch("/api/neural-core/graph");
      const data = await res.json();
      if (data.success) {
        setNodes(data.nodes);
        setEdges(data.edges);
        setStats(data.stats);
        // Calculate positions after nodes are loaded
        calculatePositions(data.nodes);
      }
    } catch (error) {
      console.error("Failed to fetch graph data:", error);
    } finally {
      setLoading(false);
    }
  }

  function calculatePositions(graphNodes: GraphNode[]) {
    if (graphNodes.length === 0) return;

    const positions: Record<string, { x: number; y: number }> = {};
    const canvasWidth = 1500;
    const canvasHeight = 500;
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;

    if (graphNodes.length === 1) {
      positions[graphNodes[0].id] = { x: centerX - 60, y: centerY - 20 };
    } else {
      // Distribute nodes in a radial layout
      const radius = Math.min(canvasWidth, canvasHeight) * 0.35;
      graphNodes.forEach((node, i) => {
        const angle = (2 * Math.PI * i) / graphNodes.length - Math.PI / 2;
        const x = centerX + radius * Math.cos(angle) - 60;
        const y = centerY + radius * Math.sin(angle) - 20;
        positions[node.id] = { x: Math.max(20, Math.min(canvasWidth - 180, x)), y: Math.max(20, Math.min(canvasHeight - 60, y)) };
      });
    }

    setNodePositions(positions);
  }

  function renderEdges() {
    return edges.map((edge) => {
      const source = nodePositions[edge.sourceNodeId];
      const target = nodePositions[edge.targetNodeId];
      if (!source || !target) return null;

      const sx = source.x + 60;
      const sy = source.y + 20;
      const tx = target.x + 60;
      const ty = target.y + 20;

      const dx = tx - sx;
      const dy = ty - sy;
      const length = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);

      return (
        <React.Fragment key={edge.id}>
          <div
            className={styles.edgeLine}
            style={{
              left: sx,
              top: sy,
              width: length,
              transform: `rotate(${angle}deg)`,
              background: `linear-gradient(90deg, rgba(123, 45, 255, 0.3), rgba(0, 229, 255, 0.3))`,
            }}
          />
          <div
            className={styles.edgeLabel}
            style={{
              left: (sx + tx) / 2 - 30,
              top: (sy + ty) / 2 - 10,
            }}
          >
            {edge.relationType.replace(/_/g, " ")}
          </div>
        </React.Fragment>
      );
    });
  }

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Activity size={48} className={styles.spinner} />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1>Knowledge Graph</h1>
          <p>The Neural Core's live intelligence map — every entity, every connection.</p>
        </div>
        <div className={styles.statsRow}>
          <div className={styles.stat}>
            <div className={styles.statValue}>{stats.totalNodes}</div>
            <div className={styles.statLabel}>Nodes</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statValue}>{stats.totalEdges}</div>
            <div className={styles.statLabel}>Edges</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statValue}>{stats.nodeTypes.length}</div>
            <div className={styles.statLabel}>Types</div>
          </div>
        </div>
      </div>

      <div className={styles.graphCanvas} ref={canvasRef}>
        {nodes.length === 0 ? (
          <div className={styles.emptyState}>
            <Network size={64} />
            <p>No knowledge nodes yet. Complete onboarding to seed the graph.</p>
          </div>
        ) : (
          <>
            {renderEdges()}
            {nodes.map((node, i) => {
              const pos = nodePositions[node.id];
              if (!pos) return null;
              return (
                <div
                  key={node.id}
                  className={`${styles.node} ${styles[`node${node.nodeType}`] || ""}`}
                  style={{
                    left: pos.x,
                    top: pos.y,
                    animationDelay: `${i * 0.15}s`,
                  }}
                  title={node.properties || ""}
                >
                  <span className={styles.nodeIcon}>{NODE_ICONS[node.nodeType] || <ArrowRight size={14} />}</span>
                  {node.label}
                </div>
              );
            })}
          </>
        )}
      </div>

      <div className={styles.legend}>
        {Object.entries(NODE_COLORS).map(([type, color]) => (
          <div key={type} className={styles.legendItem}>
            <div className={styles.legendDot} style={{ background: color }} />
            {type}
          </div>
        ))}
      </div>
    </div>
  );
}
