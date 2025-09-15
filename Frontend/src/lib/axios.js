import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://chatapp-backend-4jwx.onrender.com",
  withCredentials: true,
});
