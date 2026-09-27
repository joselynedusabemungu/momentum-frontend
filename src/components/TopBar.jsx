import { useAuth } from "../context/AuthContext";
export default function TopBar() {
  const { user, logout } = useAuth();
  return (
    <header className="topbar">
      <div className="brand">
        <span className="brand-mark">↗</span>
        <span>Momentum</span>
      </div>
      <div className="top-actions">
        <span className="user-chip">
          {(user?.full_name || user?.email || "U")[0].toUpperCase()}
        </span>
        <span className="user-name">{user?.full_name || user?.email}</span>
        <button className="ghost-button" onClick={logout}>
          Sign out
        </button>
      </div>
    </header>
  );
}
