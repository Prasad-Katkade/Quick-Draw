import { io } from "socket.io-client";

// point this to your server (same machine default)  "https://quick-draw-backend.onrender.com/";
const URL =  "https://quick-draw-backend.onrender.com/";

export const socket = io(URL, {
  autoConnect: true,
  transports: ["websocket", "polling"]
});
