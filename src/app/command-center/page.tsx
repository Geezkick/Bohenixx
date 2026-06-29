import { db } from "@/lib/db";
import styles from "./command.module.css";
import { revalidatePath } from "next/cache";
import NativeHeader from "@/components/NativeHeader";

export const dynamic = "force-dynamic";

export default async function CommandCenter() {
  const requests = await db.serviceRequest.findMany({
    orderBy: { createdAt: "desc" },
  });

  const injectActivity = async (formData: FormData) => {
    "use server";
    const app = formData.get("app") as string;
    const action = formData.get("action") as string;
    await db.activityLog.create({
      data: {
        app,
        action,
        color: "#8B2EFF",
      },
    });
    revalidatePath("/");
  };

  return (
    <>
      <NativeHeader title="Command Center" />
      <main className={styles.main}>
        <header className={styles.header}>
        <h1>God Mode <span className="text-gradient">Command Center</span></h1>
        <p>Manage the Bohenix ONE Ecosystem</p>
      </header>

      <div className={styles.grid}>
        {/* Service Requests Table */}
        <section className={`${styles.card} glass-panel`}>
          <h2>Incoming Service Requests</h2>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Email</th>
                  <th>Service</th>
                  <th>Budget</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {requests.length === 0 && (
                  <tr>
                    <td colSpan={5} className={styles.empty}>No requests found.</td>
                  </tr>
                )}
                {requests.map(req => (
                  <tr key={req.id}>
                    <td>{new Date(req.createdAt).toLocaleDateString()}</td>
                    <td>{req.email}</td>
                    <td>{req.service}</td>
                    <td>{req.budget}</td>
                    <td>
                      <span className={styles.statusBadge}>{req.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Global Controls */}
        <section className={`${styles.card} glass-panel`}>
          <h2>Global Controls</h2>
          <p>Inject an event into the public Activity Feed.</p>
          
          <form action={injectActivity} className={styles.form}>
            <input type="text" name="app" placeholder="App Name (e.g. System)" required className={styles.input} />
            <input type="text" name="action" placeholder="Action description..." required className={styles.input} />
            <button type="submit" className={styles.btn}>Broadcast Event</button>
          </form>

          <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <h3>Communication Systems</h3>
            <a href="/command-center/emails" className={styles.btn} style={{ display: 'inline-block', textDecoration: 'none', background: '#00E5FF', color: '#000' }}>
              View Email Management Dashboard
            </a>
          </div>
        </section>
      </div>
    </main>
    </>
  );
}
