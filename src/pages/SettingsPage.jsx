import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function SettingsPage() {
  const { user, logout } = useAuth();
  return (
    <div className="page-stack">
      <section className="page-heading">
        <div>
          <div className="eyebrow">WORKSPACE PREFERENCES</div>
          <h1>Settings</h1>
          <p>A quiet place for account and product preferences.</p>
        </div>
      </section>
      <section className="settings-grid">
        <article className="panel setting-card">
          <div className="setting-icon">◉</div>
          <div>
            <div className="eyebrow">ACCOUNT</div>
            <h2>{user?.full_name || "Momentum user"}</h2>
            <p>{user?.email}</p>
          </div>
        </article>
        <Link to="/reminders" className="panel setting-card setting-link">
          <div className="setting-icon">◌</div>
          <div>
            <div className="eyebrow">NOTIFICATIONS</div>
            <h2>Reminder preferences</h2>
            <p>Gmail connection and automated follow-up.</p>
          </div>
          <span>→</span>
        </Link>
        <article className="panel setting-card">
          <div className="setting-icon">✦</div>
          <div>
            <div className="eyebrow">AI</div>
            <h2>Your Coach</h2>
            <p>Controlled workspace actions and planning assistance.</p>
          </div>
        </article>
      </section>
      <button className="danger-button" onClick={logout}>
        Sign out of Momentum
      </button>
    </div>
  );
}
