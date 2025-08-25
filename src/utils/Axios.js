import axios from "axios";

const Axios = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:6502",
  withCredentials: true,
});

Axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // or however you store it
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default Axios;
