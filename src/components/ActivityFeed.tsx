"use client";

import { useEffect, useState } from "react";
import styles from "./ActivityFeed.module.css";

interface Activity {
  id: string;
  app: string;
  action: string;
  color: string;
  createdAt: string;
}

export default function ActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    fetch('/api/activity')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setActivities(data);
      })
      .catch(console.error);
  }, []);

  return (
    <div className={`${styles.feedCard} glass-panel`}>
      <div className={styles.header}>
        <h3>Ecosystem Activity</h3>
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
