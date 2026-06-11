import { useState, useEffect, type ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

const API_URL = "http://localhost:3000";

export interface User {
  email: string;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Response Interceptor - Auto Refresh on 401
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const refreshToken = localStorage.getItem("refreshToken");
          if (!refreshToken) throw new Error("No refresh token");

          const res = await api.post(`${API_URL}/auth/refresh`, {
            refreshToken,
          });

          const { accessToken, refreshToken: newRefreshToken } = res.data;

          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", newRefreshToken);

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest); // Retry original request
        } catch (refreshError) {
          console.error("Refresh token failed");
          logout();
          navigate("/login");
          return Promise.reject(refreshError);
        }
      } else {
        originalRequest._retry = false;
      }

      return Promise.reject(error);
    },
  );

  const saveTokens = (access: string, refresh: string, email: string) => {
    localStorage.setItem("accessToken", access);
    localStorage.setItem("refreshToken", refresh);
    setUser({ email });
  };

  const login = async (email: string, password: string) => {
    const res = await api.post("/auth/login", { email, password });
    saveTokens(res.data.accessToken, res.data.refreshToken, email);
  };

  const register = async (email: string, password: string) => {
    const res = await api.post("/auth/register", { email, password });
    saveTokens(res.data.accessToken, res.data.refreshToken, email);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
    navigate("/login");
  };

  // Check if already logged in on app start
  useEffect(() => {
    const initializeAuth = async () => {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");

      if (accessToken && refreshToken) {
        try {
          const res = await api.get("/auth/profile");
          setUser(res.data);
        } catch {
          // Token invalid → logout
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
