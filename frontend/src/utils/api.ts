import axios from "axios";

const API_URL = "http://localhost:3000";

const api = axios.create({
  baseURL: API_URL,
});

// Request Interceptor - Attach Token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptors are already in AuthContext, so we can import and use the same instance if you want.
// But for simplicity, you can use the api from context or this.

export const protectedApi = {
  getProfile: async () => {
    const res = await api.get("/auth/profile");
    return res.data;
  },

  // Example protected endpoints
  getUsers: async () => {
    const res = await api.get("/users"); // assuming you add this route later
    return res.data;
  },

  createPost: async (data: any) => {
    const res = await api.post("/posts", data);
    return res.data;
  },
};

export default api;
