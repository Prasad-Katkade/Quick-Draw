import { io } from "socket.io-client";

// point this to your server (same machine default)  "https://quick-draw-backend.onrender.com/";
const URL =  "http://192.168.86.75:4000/";

export const socket = io(URL, {
  autoConnect: true,
  transports: ["websocket", "polling"]
});
