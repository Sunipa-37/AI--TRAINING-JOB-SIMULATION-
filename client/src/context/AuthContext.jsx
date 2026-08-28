import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api, getToken, setToken } from "../api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const applyTheme = useCallback((theme) => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, []);

  const refresh = useCallback(async () => {
    if (!getToken()) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const me = await api.getMe();
      setUser(me);
      applyTheme(me.theme);
    } catch (err) {
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [applyTheme]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const loginWithToken = (token, userObj) => {
    setToken(token);
    setUser(userObj);
    applyTheme(userObj.theme);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    applyTheme("light");
  };

  const toggleTheme = async () => {
    if (!user) return;
    const next = user.theme === "dark" ? "light" : "dark";
    setUser({ ...user, theme: next });
    applyTheme(next);
    try {
      await api.setTheme(next);
    } catch (err) {
      // non-fatal — UI already updated optimistically
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginWithToken, logout, toggleTheme, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
