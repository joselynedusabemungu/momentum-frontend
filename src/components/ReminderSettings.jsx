import { useEffect, useRef, useState } from "react";

const labels = {
  due_24h_enabled: "24-hour deadline reminder",
  due_1h_enabled: "1-hour deadline reminder",
  overdue_enabled: "Overdue check-in",
  follow_up_enabled: "Follow up on unfinished tasks",
};

export default function ReminderSettings({
  status,
  settings,
  settingsReady,
  onConnect,
  onDisconnect,
  onTest,
  onUpdate,
  pending,
}) {
  const [message, setMessage] = useState("");
  const timezoneSyncAttempted = useRef(null);

  useEffect(() => {
    if (!settingsReady) return;
    const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (
      !browserTimezone ||
      !settings.timezone ||
      settings.timezone === browserTimezone
    )
      return;
    if (timezoneSyncAttempted.current === browserTimezone) return;

    timezoneSyncAttempted.current = browserTimezone;
    onUpdate({ timezone: browserTimezone });
  }, [settingsReady, settings.timezone, onUpdate]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const gmail = params.get("gmail");
    if (gmail === "connected")
      setMessage("Gmail connected. Momentum can now send reminders.");
    if (gmail === "denied") setMessage("Gmail access was not granted.");
    if (gmail === "expired" || gmail === "error")
      setMessage("Gmail connection could not be completed. Try again.");
    if (gmail)
      window.history.replaceState({}, document.title, window.location.pathname);
  }, []);

  const toggle = (key) => onUpdate({ [key]: !settings[key] });

  return (
    <section className="panel reminder-panel">
      <div className="panel-head">
        <div>
          <div className="eyebrow">FOLLOW THROUGH</div>
          <h2>Email reminders</h2>
        </div>
        <span
          className={`connection-pill ${status?.connected ? "connected" : ""}`}
        >
          {status?.connected ? "Connected" : "Not connected"}
        </span>
      </div>
      <div className="reminder-body">
        <p className="helper-text">
          Let Momentum check unfinished work and send gentle reminders to your
          connected Gmail. Times use your device timezone.
        </p>
        {!status?.connected ? (
          <button
            className="secondary-button"
            onClick={onConnect}
            disabled={pending}
          >
            Connect Gmail
          </button>
        ) : (
          <div className="gmail-connected">
            <div>
              <strong>{status.email}</strong>
              <span>Gmail sending is enabled.</span>
            </div>
            <div className="gmail-actions">
              <button
                className="ghost-button"
                onClick={onTest}
                disabled={pending}
              >
                Send test
              </button>
              <button
                className="ghost-button"
                onClick={onDisconnect}
                disabled={pending}
              >
                Disconnect
              </button>
            </div>
          </div>
        )}
        {message && <div className="success-note">{message}</div>}
        <div className="toggle-list">
          <label>
            <span>Email reminders</span>
            <input
              type="checkbox"
              checked={settings.email_enabled}
              onChange={() => toggle("email_enabled")}
            />
          </label>
          {Object.keys(labels).map((key) => (
            <label key={key}>
              <span>{labels[key]}</span>
              <input
                type="checkbox"
                checked={settings[key]}
                disabled={!settings.email_enabled}
                onChange={() => toggle(key)}
              />
            </label>
          ))}
        </div>
        <div className="reminder-controls">
          <label>
            Follow-up interval
            <select
              value={settings.follow_up_interval_hours}
              disabled={!settings.email_enabled || !settings.follow_up_enabled}
              onChange={(e) =>
                onUpdate({ follow_up_interval_hours: Number(e.target.value) })
              }
            >
              <option value="12">Every 12 hours</option>
              <option value="24">Every 24 hours</option>
              <option value="48">Every 2 days</option>
              <option value="72">Every 3 days</option>
            </select>
          </label>
          <label>
            Max follow-ups per task
            <select
              value={settings.follow_up_max_per_task}
              disabled={!settings.email_enabled || !settings.follow_up_enabled}
              onChange={(e) =>
                onUpdate({ follow_up_max_per_task: Number(e.target.value) })
              }
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="5">5</option>
            </select>
          </label>
        </div>
      </div>
    </section>
  );
}
