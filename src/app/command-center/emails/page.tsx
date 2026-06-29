import { db } from "@/lib/db";
import styles from "../command.module.css";
import NativeHeader from "@/components/NativeHeader";

export const dynamic = "force-dynamic";

export default async function EmailDashboard() {
  const emails = await db.emailLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 100, // Show last 100 emails
  });

  const totalSent = await db.emailLog.count({ where: { status: 'SENT' } });
  const totalFailed = await db.emailLog.count({ where: { status: 'FAILED' } });

  return (
    <>
      <NativeHeader title="Email Management Dashboard" />
      <main className={styles.main}>
        <header className={styles.header}>
          <h1>Email <span className="text-gradient">Infrastructure</span></h1>
          <p>Monitor Bohenix Ecosystem Email Communications</p>
        </header>

        <div className={styles.grid}>
          {/* Email Stats */}
          <section className={`${styles.card} glass-panel`} style={{ display: 'flex', gap: '2rem' }}>
            <div>
              <h3 style={{ color: '#00E5FF', fontSize: '2rem', margin: 0 }}>{totalSent}</h3>
              <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>Emails Delivered</p>
            </div>
            <div>
              <h3 style={{ color: '#FF3D00', fontSize: '2rem', margin: 0 }}>{totalFailed}</h3>
              <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>Delivery Failures</p>
            </div>
          </section>

          {/* Email Logs Table */}
          <section className={`${styles.card} glass-panel`} style={{ gridColumn: '1 / -1' }}>
            <h2>Recent Transactions</h2>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Subject</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {emails.length === 0 && (
                    <tr>
                      <td colSpan={6} className={styles.empty}>No email logs found.</td>
                    </tr>
                  )}
                  {emails.map(log => (
                    <tr key={log.id}>
                      <td>{new Date(log.createdAt).toLocaleString()}</td>
                      <td>
                        <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', background: 'rgba(255,255,255,0.1)' }}>
                          {log.type}
                        </span>
                      </td>
                      <td style={{ color: '#00E5FF' }}>{log.from}</td>
                      <td>{log.to}</td>
                      <td>{log.subject}</td>
                      <td>
                        <span className={styles.statusBadge} style={{ background: log.status === 'SENT' ? '#00C85320' : '#FF3D0020', color: log.status === 'SENT' ? '#00C853' : '#FF3D00' }}>
                          {log.status}
                        </span>
                        {log.error && <div style={{ fontSize: '0.8rem', color: '#FF3D00', marginTop: '4px' }}>{log.error}</div>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
