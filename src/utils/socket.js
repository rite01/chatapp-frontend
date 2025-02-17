import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:8001"; // Replace with your backend URL
const socket = io(SOCKET_URL, {
  withCredentials: true,
  transports: ["websocket"],
});

export default socket;
