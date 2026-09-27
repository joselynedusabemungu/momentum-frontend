import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ReminderSettings from "../components/ReminderSettings";
import { api } from "../api/client";

export default function RemindersPage() {
  const qc = useQueryClient();
  const settingsQ = useQuery({
    queryKey: ["notification-settings"],
    queryFn: api.notificationSettings,
  });
  const gmailQ = useQuery({
    queryKey: ["gmail-status"],
    queryFn: api.gmailStatus,
  });
  const historyQ = useQuery({
    queryKey: ["notification-history"],
    queryFn: api.notificationHistory,
  });
  const update = useMutation({
    mutationFn: api.updateNotificationSettings,
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["notification-settings"] }),
  });
  const disconnect = useMutation({
    mutationFn: api.gmailDisconnect,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["gmail-status"] }),
  });
  const test = useMutation({
    mutationFn: api.gmailTest,
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["notification-history"] }),
  });
  const connect = async () => {
    const result = await api.gmailConnect();
    window.location.href = result.authorization_url;
  };
  return (
    <div className="page-stack">
      <section className="page-heading">
        <div>
          <div className="eyebrow">AUTOMATED FOLLOW-THROUGH</div>
          <h1>Reminders</h1>
          <p>
            Let Momentum notice deadlines and gently bring unfinished work back
            into view.
          </p>
        </div>
        <div className="automation-badge">
          <span /> Worker active
        </div>
      </section>
      <ReminderSettings
        status={gmailQ.data}
        settings={
          settingsQ.data || {
            email_enabled: true,
            due_24h_enabled: true,
            due_1h_enabled: true,
            overdue_enabled: true,
            follow_up_enabled: true,
            follow_up_interval_hours: 24,
            follow_up_max_per_task: 3,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
          }
        }
        settingsReady={settingsQ.isSuccess}
        onConnect={connect}
        onDisconnect={() => disconnect.mutate()}
        onTest={() => test.mutate()}
        onUpdate={(payload) => update.mutate(payload)}
        pending={disconnect.isPending || test.isPending || update.isPending}
      />
      <section className="panel">
        <div className="panel-head">
          <div>
            <div className="eyebrow">DELIVERY LOG</div>
            <h2>Recent notifications</h2>
          </div>
        </div>
        {historyQ.data?.length ? (
          historyQ.data.map((n) => (
            <div className="notification-row" key={n.id}>
              <span
                className={`event-tag ${n.status === "sent" ? "positive" : "critical"}`}
              >
                {n.status}
              </span>
              <div>
                <strong>{n.subject}</strong>
                <small>{new Date(n.sent_at).toLocaleString()}</small>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state compact">
            <span>No automated reminders yet.</span>
          </div>
        )}
      </section>
    </div>
  );
}
