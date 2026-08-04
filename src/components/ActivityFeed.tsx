"use client";

import { useEffect, useState } from "react";
import styles from "./ActivityFeed.module.css";
import { Radio } from "lucide-react";

interface Activity {
  id: string;
  app: string;
  action: string;
  color: string;
  createdAt: string;
}

export default function ActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    // Initial fetch
    fetch('/api/activity')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setActivities(data);
      })
      .catch(console.error);

    // Subscribe to SSE stream
    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource('/api/activity/stream');

      eventSource.onopen = () => {
        setIsLive(true);
      };

      eventSource.onmessage = (event) => {
        try {
          const newEvent = JSON.parse(event.data);
          if (newEvent.type === 'connected') return;

          setActivities(prev => [newEvent, ...prev.slice(0, 5)]);
        } catch (e) {
          console.error("SSE parse error", e);
        }
      };

      eventSource.onerror = () => {
        setIsLive(false);
        if (eventSource) eventSource.close();
      };
    } catch (err) {
      console.error("SSE connection error", err);
    }

    return () => {
      if (eventSource) eventSource.close();
    };
  }, []);

  return (
    <div className={`${styles.feedCard} glass-panel`}>
      <div className={styles.header} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>Ecosystem Activity</h3>
        {isLive && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: '#22c55e', background: 'rgba(34, 197, 94, 0.1)', padding: '0.2rem 0.5rem', borderRadius: '12px', border: '1px solid rgba(34, 197, 94, 0.3)' }}>
            <Radio size={12} className="animate-pulse" />
            <span>LIVE STREAM</span>
          </div>
        )}
      </div>
      <div className={styles.feedList}>
        {activities.length === 0 && <p style={{color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem'}}>No recent activity.</p>}
        {activities.map((activity) => (
          <div key={activity.id} className={styles.feedItem}>
            <div className={styles.dot} style={{ backgroundColor: activity.color, boxShadow: `0 0 8px ${activity.color}` }}></div>
            <div className={styles.content}>
              <p className={styles.action}>
                <strong>{activity.app}:</strong> {activity.action}
              </p>
              <span className={styles.time}>{new Date(activity.createdAt).toLocaleTimeString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
