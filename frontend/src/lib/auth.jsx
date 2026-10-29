import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api, setUnauthorizedHandler, tokenStore } from "./api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState(() => (tokenStore.get() ? "loading" : "anon"));

  const logout = useCallback(() => {
    tokenStore.set(null);
    setUser(null);
    setStatus("anon");
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(logout);
    if (!tokenStore.get()) return;
    api("/auth/me", { auth: true })
      .then(({ user }) => {
        setUser(user);
        setStatus("authed");
      })
      .catch((error) => {
        // Keep the token on network errors so a cold server doesn't log people out.
        if (error.status === 401) logout();
        else setStatus("offline");
      });
  }, [logout]);

  const startSession = useCallback(({ token, user }) => {
    tokenStore.set(token);
    setUser(user);
    setStatus("authed");
  }, []);

  const value = useMemo(
    () => ({ user, status, setUser, startSession, logout }),
    [user, status, startSession, logout]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
