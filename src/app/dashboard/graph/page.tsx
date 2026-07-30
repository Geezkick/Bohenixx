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
  const [isSeeding, setIsSeeding] = useState(false);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [nodePositions, setNodePositions] = useState<Record<string, { x: number; y: number }>>({});
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchGraph();
    // Auto-refresh graph every 8 seconds to catch live agent activity
    const interval = setInterval(fetchGraph, 8000);
    return () => clearInterval(interval);
  }, []);

  async function fetchGraph() {
    try {
      const res = await fetch("/api/neural-core/graph");
      const data = await res.json();
      if (data.success) {
        setNodes(data.nodes);
        setEdges(data.edges);
        setStats(data.stats);
        calculatePositions(data.nodes);
      }
    } catch (error) {
      console.error("Failed to fetch graph data:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSeedGraph() {
    setIsSeeding(true);
    try {
      const res = await fetch("/api/neural-core/graph", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "seed" }),
      });
      const data = await res.json();
      if (data.success) {
        setNodes(data.nodes);
        setEdges(data.edges);
        setStats(data.stats);
        calculatePositions(data.nodes);
      }
    } catch (error) {
      console.error("Failed to seed graph:", error);
    } finally {
      setIsSeeding(false);
    }
  }

  function calculatePositions(graphNodes: GraphNode[]) {
    if (graphNodes.length === 0) return;

    const positions: Record<string, { x: number; y: number }> = {};
    const canvasWidth = 1400;
    const canvasHeight = 520;
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;

    if (graphNodes.length === 1) {
      positions[graphNodes[0].id] = { x: centerX - 60, y: centerY - 20 };
    } else {
      // Concentric / radial distribution
      const radius = Math.min(canvasWidth, canvasHeight) * 0.36;
      graphNodes.forEach((node, i) => {
        const angle = (2 * Math.PI * i) / graphNodes.length - Math.PI / 2;
        const jitter = (i % 2 === 0 ? 1 : 0.85);
        const x = centerX + radius * jitter * Math.cos(angle) - 60;
        const y = centerY + radius * jitter * Math.sin(angle) - 20;
        positions[node.id] = {
          x: Math.max(20, Math.min(canvasWidth - 180, x)),
          y: Math.max(20, Math.min(canvasHeight - 60, y))
        };
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

      const isConnectedToSelected = selectedNode && (edge.sourceNodeId === selectedNode.id || edge.targetNodeId === selectedNode.id);

      return (
        <React.Fragment key={edge.id}>
          <div
            className={styles.edgeLine}
            style={{
              left: sx,
              top: sy,
              width: length,
              transform: `rotate(${angle}deg)`,
              background: isConnectedToSelected
                ? `linear-gradient(90deg, #A78BFA, #00E5FF)`
                : `linear-gradient(90deg, rgba(123, 45, 255, 0.3), rgba(0, 229, 255, 0.3))`,
              height: isConnectedToSelected ? "2px" : "1px",
              zIndex: isConnectedToSelected ? 5 : 1,
            }}
          />
          <div
            className={styles.edgeLabel}
            style={{
              left: (sx + tx) / 2 - 35,
              top: (sy + ty) / 2 - 10,
              opacity: isConnectedToSelected ? 1 : 0.6,
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
          <p>The Neural Core's live intelligence map — every entity, every relationship.</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
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
          <button
            onClick={handleSeedGraph}
            disabled={isSeeding}
            style={{
              padding: "0.6rem 1.25rem",
              borderRadius: "8px",
              background: "rgba(123, 45, 255, 0.15)",
              border: "1px solid rgba(123, 45, 255, 0.3)",
              color: "#A78BFA",
              fontWeight: 600,
              fontSize: "0.85rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              transition: "all 0.2s ease"
            }}
          >
            {isSeeding ? <Activity size={14} className={styles.spinner} /> : <Network size={14} />}
            {isSeeding ? "Syncing..." : "Sync Graph"}
          </button>
        </div>
      </div>

      <div className={styles.graphCanvas} ref={canvasRef} onClick={() => setSelectedNode(null)}>
        {nodes.length === 0 ? (
          <div className={styles.emptyState}>
            <Network size={64} color="#A78BFA" />
            <p style={{ marginTop: "1rem", color: "rgba(255,255,255,0.7)" }}>No knowledge nodes yet.</p>
            <button
              onClick={handleSeedGraph}
              style={{
                marginTop: "1rem",
                padding: "0.6rem 1.5rem",
                borderRadius: "8px",
                background: "#7B2DFF",
                color: "#fff",
                border: "none",
                fontWeight: 600,
                cursor: "pointer"
              }}
            >
              Seed Graph
            </button>
          </div>
        ) : (
          <>
            {renderEdges()}
            {nodes.map((node, i) => {
              const pos = nodePositions[node.id];
              if (!pos) return null;
              const isSelected = selectedNode?.id === node.id;
              return (
                <div
                  key={node.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedNode(node);
                  }}
                  className={`${styles.node} ${styles[`node${node.nodeType}`] || ""}`}
                  style={{
                    left: pos.x,
                    top: pos.y,
                    animationDelay: `${i * 0.1}s`,
                    borderColor: isSelected ? "#00E5FF" : undefined,
                    boxShadow: isSelected ? "0 0 20px rgba(0, 229, 255, 0.4)" : undefined,
                    cursor: "pointer",
                    zIndex: isSelected ? 10 : 2
                  }}
                >
                  <span className={styles.nodeIcon}>{NODE_ICONS[node.nodeType] || <ArrowRight size={14} />}</span>
                  {node.label}
                </div>
              );
            })}
          </>
        )}
      </div>

      {selectedNode && (
        <div style={{
          marginTop: "1rem",
          padding: "1.25rem",
          borderRadius: "12px",
          background: "rgba(10, 10, 15, 0.8)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(12px)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <div>
            <div style={{ fontSize: "0.75rem", color: "#A78BFA", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px" }}>
              SELECTED NODE • {selectedNode.nodeType}
            </div>
            <div style={{ fontSize: "1.1rem", fontWeight: 600, color: "#fff", marginTop: "4px" }}>
              {selectedNode.label}
            </div>
            {selectedNode.properties && (
              <div style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.6)", marginTop: "4px", fontFamily: "monospace" }}>
                Properties: {selectedNode.properties}
              </div>
            )}
          </div>
          <button
            onClick={() => setSelectedNode(null)}
            style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: "1.2rem" }}
          >
            ✕
          </button>
        </div>
      )}

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
