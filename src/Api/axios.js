import axios from "axios";

const axiosInstance = axios.create({
  // baseURL: "http://localhost:8001/api/",
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
