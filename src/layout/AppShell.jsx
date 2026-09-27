import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const primaryLinks = [
  { to: "/", label: "Today", end: true },
  { to: "/tasks", label: "Tasks" },
  { to: "/goals", label: "Goals" },
  { to: "/progress", label: "Progress" },
  { to: "/ai", label: "✦ AI Coach", ai: true },
];

const secondaryLinks = [
  { to: "/reminders", label: "Reminders", icon: "◌" },
  { to: "/settings", label: "Settings", icon: "⚙" },
];

function AppNav({ onNavigate }) {
  return (
    <nav className="top-nav-links" aria-label="Main navigation">
      {primaryLinks.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.end}
          onClick={onNavigate}
          className={({ isActive }) =>
            `top-nav-link${isActive ? " active" : ""}${link.ai ? " ai-link" : ""}`
          }
        >
          {link.label}
        </NavLink>
      ))}
    </nav>
  );
}

export default function AppShell() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const profileRef = useRef(null);
  const notificationRef = useRef(null);
  const initial = (user?.full_name || user?.email || "U")
    .slice(0, 1)
    .toUpperCase();
  const firstName = user?.full_name?.split(" ")[0] || "there";

  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
    setNotificationsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target))
        setProfileOpen(false);
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      )
        setNotificationsOpen(false);
    };
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  const signOut = async () => {
    setProfileOpen(false);
    await logout();
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <NavLink to="/" className="brand" aria-label="Momentum home">
            <span className="brand-mark">↗</span>
            <span className="brand-wordmark">Momentum</span>
          </NavLink>

          <AppNav />

          <div className="topbar-actions">
            <div className="dropdown-anchor" ref={notificationRef}>
              <button
                className={`topbar-icon-button${notificationsOpen ? " open" : ""}`}
                onClick={() => {
                  setNotificationsOpen((v) => !v);
                  setProfileOpen(false);
                }}
                aria-label="Notifications"
                aria-expanded={notificationsOpen}
              >
                <span className="bell-icon">♧</span>
                <span className="notification-dot" aria-hidden="true" />
              </button>
              {notificationsOpen && (
                <div className="dropdown notification-menu">
                  <div className="dropdown-header">
                    <div>
                      <span className="eyebrow">INBOX</span>
                      <strong>Notifications</strong>
                    </div>
                    <span className="unread-pill">2 new</span>
                  </div>
                  <button
                    className="notification-item"
                    onClick={() => navigate("/reminders")}
                  >
                    <span className="notification-symbol">!</span>
                    <span>
                      <strong>Stay ahead of deadlines</strong>
                      <small>
                        Review your reminder settings and delivery history.
                      </small>
                    </span>
                  </button>
                  <button
                    className="notification-item"
                    onClick={() => navigate("/tasks")}
                  >
                    <span className="notification-symbol">✓</span>
                    <span>
                      <strong>Your next action is waiting</strong>
                      <small>Open Tasks to keep today's momentum moving.</small>
                    </span>
                  </button>
                  <button
                    className="dropdown-footer"
                    onClick={() => navigate("/reminders")}
                  >
                    Open reminders →
                  </button>
                </div>
              )}
            </div>

            <div className="dropdown-anchor profile-anchor" ref={profileRef}>
              <button
                className={`profile-trigger${profileOpen ? " open" : ""}`}
                onClick={() => {
                  setProfileOpen((v) => !v);
                  setNotificationsOpen(false);
                }}
                aria-label="Open profile menu"
                aria-expanded={profileOpen}
              >
                <span className="avatar">{initial}</span>
                <span className="profile-trigger-copy">
                  <strong>{firstName}</strong>
                  <small>Personal space</small>
                </span>
                <span className="chevron">⌄</span>
              </button>
              {profileOpen && (
                <div className="dropdown profile-menu">
                  <div className="profile-menu-head">
                    <span className="avatar large">{initial}</span>
                    <div>
                      <strong>{user?.full_name || "Momentum user"}</strong>
                      <small>{user?.email}</small>
                    </div>
                  </div>
                  <NavLink
                    to="/settings"
                    className="dropdown-link"
                    onClick={() => setProfileOpen(false)}
                  >
                    <span>⚙</span> Settings
                  </NavLink>
                  <button className="dropdown-link" onClick={signOut}>
                    <span>↪</span> Sign out
                  </button>
                </div>
              )}
            </div>

            <button
              className={`mobile-menu-button${mobileOpen ? " open" : ""}`}
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Open navigation"
              aria-expanded={mobileOpen}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <div
        className={`mobile-drawer${mobileOpen ? " open" : ""}`}
        aria-hidden={!mobileOpen}
      >
        <div
          className="mobile-drawer-backdrop"
          onClick={() => setMobileOpen(false)}
        />
        <aside className="mobile-drawer-panel">
          <div className="mobile-drawer-head">
            <span className="eyebrow">WORKSPACE</span>
            <button
              className="icon-button"
              onClick={() => setMobileOpen(false)}
              aria-label="Close navigation"
            >
              ×
            </button>
          </div>
          <AppNav onNavigate={() => setMobileOpen(false)} />
          <div className="mobile-secondary-nav">
            {secondaryLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `mobile-secondary-link${isActive ? " active" : ""}`
                }
              >
                <span>{link.icon}</span>
                {link.label}
              </NavLink>
            ))}
          </div>
          <div className="mobile-user-card">
            <span className="avatar">{initial}</span>
            <div>
              <strong>{user?.full_name || "Momentum user"}</strong>
              <small>{user?.email}</small>
            </div>
          </div>
        </aside>
      </div>

      <main className="page-content">
        <Outlet />
      </main>
    </div>
  );
}
