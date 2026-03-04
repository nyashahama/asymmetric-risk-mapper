import axios, { AxiosError, type AxiosInstance } from "axios";

const apiClient: AxiosInstance = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ||
    "https://asymmetric-risk-mapper-backend.onrender.com/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const anon_token = localStorage.getItem("anon_token");
    // Backend middleware reads X-Anon-Token, not Authorization
    if (anon_token) config.headers["X-Anon-Token"] = anon_token;
    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("anon_token");
      localStorage.removeItem("session_id");
      window.location.href = "/";
    }
    return Promise.reject(error);
  },
);

export default apiClient;
