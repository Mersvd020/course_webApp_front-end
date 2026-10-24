import axios from "axios";

export const api = axios.create({
  // Keep browser requests on the frontend origin; Next.js forwards them upstream.
  baseURL: "/api/backend",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});
