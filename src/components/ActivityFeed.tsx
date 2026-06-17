import styles from "./ActivityFeed.module.css";

const MOCK_ACTIVITIES = [
  { id: 1, app: "Safura", action: "Generated AI health report for User #891", time: "2 mins ago", color: "#00E5FF" },
  { id: 2, app: "System", action: "Global telemetry synchronization completed", time: "15 mins ago", color: "#8B2EFF" },
  { id: 3, app: "NjiaSafe", action: "Issued route advisory for Region B", time: "1 hour ago", color: "#00C853" },
  { id: 4, app: "Mboka", action: "15 new skilled workers verified", time: "3 hours ago", color: "#FF6D00" },
];

export default function ActivityFeed() {
  return (
    <div className={`${styles.feedCard} glass-panel`}>
      <div className={styles.header}>
        <h3>Ecosystem Activity</h3>
      </div>
      <div className={styles.feedList}>
        {MOCK_ACTIVITIES.map((activity) => (
          <div key={activity.id} className={styles.feedItem}>
            <div className={styles.dot} style={{ backgroundColor: activity.color, boxShadow: `0 0 8px ${activity.color}` }}></div>
            <div className={styles.content}>
              <p className={styles.action}>
                <strong>{activity.app}:</strong> {activity.action}
              </p>
              <span className={styles.time}>{activity.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
