import { useState } from "react";
import { useAuth } from "../context/AuthContext";
export default function Login() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState("login"),
    [email, setEmail] = useState(""),
    [password, setPassword] = useState(""),
    [name, setName] = useState(""),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  const signup = mode === "register";
  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      signup
        ? await register(email, password, name)
        : await login(email, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="auth-page">
      <div className="auth-shell">
        <div className="auth-copy">
          <div className="brand large">
            <span className="brand-mark">↗</span>
            <span>Momentum</span>
          </div>
          <div className="auth-eyebrow">PERSONAL PROGRESS SYSTEM</div>
          <h1>
            Make progress <em>visible.</em>
          </h1>
          <p>
            Keep your tasks clear, your goals close, and let your AI copilot
            help you decide what matters next.
          </p>
          <div className="auth-points">
            <span>Your own private workspace</span>
            <span>Secure session-based authentication</span>
            <span>AI that can act through controlled tools</span>
          </div>
        </div>
        <div className="auth-card">
          <div className="eyebrow">
            {signup ? "GET STARTED" : "WELCOME BACK"}
          </div>
          <h2>{signup ? "Create your workspace" : "Continue your momentum"}</h2>
          <p>
            {signup
              ? "A simple space for useful work and meaningful progress."
              : "Your next useful step is waiting."}
          </p>
          <form onSubmit={submit}>
            {signup && (
              <label>
                Name
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  autoComplete="name"
                />
              </label>
            )}
            <label>
              Email
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </label>
            <label>
              Password
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                autoComplete={signup ? "new-password" : "current-password"}
              />
            </label>
            {error && <div className="form-error">{error}</div>}
            <button className="primary-button wide" disabled={busy}>
              {busy ? "Working…" : signup ? "Create account" : "Sign in"}
            </button>
          </form>
          <button
            className="switch"
            onClick={() => {
              setMode(signup ? "login" : "register");
              setError("");
            }}
          >
            {signup
              ? "Already have an account? Sign in"
              : "New here? Create an account"}
          </button>
        </div>
      </div>
    </div>
  );
}
