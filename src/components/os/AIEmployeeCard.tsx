import React from "react";
import Link from "next/link";
import styles from "@/app/dashboard/dashboard.module.css";
import { PulseIndicator } from "@/components/os/PulseIndicator";

export interface AIEmployee {
  id: string | number;
  name: string;
  role: string;
  status: "Executing" | "Planning" | "Idle" | "Error";
  currentTask: string;
  confidence: string;
  tool: string;
  color: string;
}

interface Props {
  agent: AIEmployee;
}

export default function AIEmployeeCard({ agent }: Props) {
  return (
    <Link href={`/dashboard/ai-employees/${agent.id}`} className={styles.agentCardOS}>
      <div className={styles.agentCardTop}>
        <div className={styles.agentAvatar} style={{ borderColor: agent.color }}>
          {agent.name.charAt(0)}
        </div>
        <div className={styles.agentInfo}>
          <div className={styles.agentName}>{agent.name}</div>
          <div className={styles.agentRole}>{agent.role}</div>
        </div>
        <div className={styles.agentStatusBadge} style={{ color: agent.color, backgroundColor: `${agent.color}15` }}>
          <PulseIndicator active={agent.status !== "Idle" && agent.status !== "Error"} color={agent.color} />
          {agent.status}
        </div>
      </div>
      <div className={styles.agentCardBody}>
        <div className={styles.agentTaskLabel}>CURRENT TASK</div>
        <div className={styles.agentTaskText}>{agent.currentTask}</div>
      </div>
      <div className={styles.agentCardFooter}>
        <div className={styles.agentMetric}>
          <span className={styles.metricLabel}>CONF</span>
          <span className={styles.metricValue}>{agent.confidence}</span>
        </div>
        <div className={styles.agentMetric}>
          <span className={styles.metricLabel}>TOOL</span>
          <span className={styles.metricValue}>{agent.tool}</span>
        </div>
      </div>
    </Link>
  );
}
