import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { api } from "../api/client";

const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const loadUser = useCallback(async () => {
    try {
      const me = await api.me();
      setUser(me);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    loadUser();
  }, [loadUser]);
  const login = async (email, password) => {
    const me = await api.login(email, password);
    await api.csrf();
    setUser(me);
  };
  const register = async (email, password, fullName) => {
    await api.register({ email, password, full_name: fullName || null });
    await login(email, password);
  };
  const logout = async () => {
    try {
      await api.logout();
    } finally {
      setUser(null);
    }
  };
  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used within AuthProvider");
  return value;
}
