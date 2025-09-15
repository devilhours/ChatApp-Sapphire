import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development" 
    ? "https://chatapp-backend-4jwx.onrender.com/api" 
    : "http://localhost:5001/api",
  withCredentials: true,
});
