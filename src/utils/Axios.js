// src/utils/axios.jsx
import axios from "axios";


const Axios = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:6502",
});

Axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// export default Axios;


// Interceptor to attach JWT token
Axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      // Always send as "Bearer <token>"
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Optional: interceptor to handle expired tokens globally
Axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 403) {
      console.warn("Token expired or invalid. Logging out...");
      localStorage.removeItem("token");
      window.location.href = "/login"; // redirect user
    }
    return Promise.reject(error);
  }
);

export default Axios;
