"use client";

import React from "react";
import { motion } from "framer-motion";
import { PulseIndicator } from "./PulseIndicator";

export type ExecutionStep = {
  id: string;
  label: string;
  status: "pending" | "running" | "completed" | "error";
  logs?: string[];
};

interface Props {
  steps: ExecutionStep[];
}

export function ExecutionLog({ steps }: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {steps.map((step, index) => {
        const isRunning = step.status === "running";
        const isCompleted = step.status === "completed";
        const isError = step.status === "error";

        let color = "#6B7280"; // pending
        if (isRunning) color = "#A78BFA";
        if (isCompleted) color = "#22c55e";
        if (isError) color = "#EF4444";

        return (
          <div key={step.id} style={{ display: "flex", gap: "1rem", position: "relative" }}>
            {/* Connecting line */}
            {index < steps.length - 1 && (
              <div 
                style={{
                  position: "absolute",
                  left: "9px",
                  top: "24px",
                  bottom: "-24px",
                  width: "2px",
                  background: isCompleted ? "#22c55e" : "rgba(255,255,255,0.1)",
                  zIndex: 0
                }}
              />
            )}
            
            <div style={{ zIndex: 1, paddingTop: "4px" }}>
              {isRunning ? (
                <PulseIndicator active={true} color={color} />
              ) : (
                <div style={{ 
                  width: "20px", 
                  height: "20px", 
                  borderRadius: "50%", 
                  border: `2px solid ${color}`,
                  background: isCompleted ? color : "#050505"
                }} />
              )}
            </div>
            
            <div style={{ flex: 1, paddingBottom: "1rem" }}>
              <div style={{ color: "#fff", fontWeight: 600, fontSize: "0.95rem", marginBottom: "4px" }}>
                {step.label}
              </div>
              
              {isRunning && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  style={{ overflow: "hidden" }}
                >
                  <div style={{ 
                    marginTop: "8px",
                    padding: "0.75rem",
                    background: "rgba(0,0,0,0.3)",
                    border: "1px solid rgba(255,255,255,0.05)",
                    borderRadius: "8px",
                    fontFamily: "monospace",
                    fontSize: "0.8rem",
                    color: "rgba(255,255,255,0.6)"
                  }}>
                    {step.logs && step.logs.length > 0 ? (
                      step.logs.map((log, i) => (
                        <div key={i}>{log}</div>
                      ))
                    ) : (
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span className="typingDot" style={{ color }}/>
                        <span className="typingDot" style={{ color }}/>
                        <span className="typingDot" style={{ color }}/>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
