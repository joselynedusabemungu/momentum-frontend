import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import TasksPage from "./pages/TasksPage";
import GoalsPage from "./pages/GoalsPage";
import ProgressPage from "./pages/ProgressPage";
import AIPage from "./pages/AIPage";
import RemindersPage from "./pages/RemindersPage";
import SettingsPage from "./pages/SettingsPage";
import AppShell from "./layout/AppShell";

function ProtectedApp() {
  const { user, loading } = useAuth();
  if (loading)
    return (
      <div className="boot">
        <span className="pulse-dot" /> Loading Momentum…
      </div>
    );
  if (!user) return <Login />;

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/goals" element={<GoalsPage />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/ai" element={<AIPage />} />
          <Route path="/reminders" element={<RemindersPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ProtectedApp />
    </AuthProvider>
  );
}
