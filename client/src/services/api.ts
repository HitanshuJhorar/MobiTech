import axios, { AxiosInstance } from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default api;
