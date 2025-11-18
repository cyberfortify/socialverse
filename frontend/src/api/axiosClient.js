import axios from "axios";
import { getCookie } from "../utils/csrf";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api/",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const method = (config.method || "").toUpperCase();
  if (!["GET", "HEAD", "OPTIONS"].includes(method)) {
    const csrftoken = getCookie("csrftoken");
    if (csrftoken) config.headers["X-CSRFToken"] = csrftoken;
  }
  return config;
});

export default api;
