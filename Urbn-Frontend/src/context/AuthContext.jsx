import React, { createContext, useEffect, useState } from "react";
import { loginUser, registerUser } from "../services/authService";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("urbn_token");
    const storedUser = localStorage.getItem("urbn_user");
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const persistSession = (authResponse) => {
    const loggedInUser = {
      id: authResponse.id,
      name: authResponse.name,
      email: authResponse.email,
      role: authResponse.role,
    };
    localStorage.setItem("urbn_token", authResponse.token);
    localStorage.setItem("urbn_user", JSON.stringify(loggedInUser));
    setToken(authResponse.token);
    setUser(loggedInUser);
    return loggedInUser;
  };

  const login = async (credentials) => {
    const data = await loginUser(credentials);
    return persistSession(data);
  };

  const register = async (payload) => {
    const data = await registerUser(payload);
    return persistSession(data);
  };

  const logout = () => {
    localStorage.removeItem("urbn_token");
    localStorage.removeItem("urbn_user");
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    isAuthenticated: Boolean(token && user),
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
