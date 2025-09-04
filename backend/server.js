import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors({ origin: "*" })); // tighten in prod

// Simple health route
app.get("/", (_, res) => res.send("QuickDraw server is running"));

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

// --- Socket.IO room logic ---
io.on("connection", (socket) => {
  // Clients call "join-room" with { roomId, clientInfo }
  socket.on("join-room", ({ roomId }) => {
    socket.join(roomId);
    socket.data.roomId = roomId;
    socket.emit("joined", { roomId });
    console.log(`socket ${socket.id} joined room ${roomId}`);
    socket.to(roomId).emit("peer-joined", { id: socket.id });
  });

  // Incoming drawing segments from one client -> broadcast to room peers
  // payload: { roomId, strokeId, segments: [{x,y,t,pressure}], color, lineWidth }
  socket.on("draw", (payload) => {
    const { roomId } = payload;
    console.log("got draw", payload);
    if (!roomId) return;
    // broadcast to everyone else in the room
    socket.to(roomId).emit("draw", payload);
  });

  // Optional: clear canvas event
  socket.on("clear", ({ roomId }) => {
    if (!roomId) return;
    socket.to(roomId).emit("clear");
  });

  socket.on("disconnect", () => {
    const roomId = socket.data?.roomId;
    if (roomId) socket.to(roomId).emit("peer-left", { id: socket.id });
  });
});

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`QuickDraw server listening on http://localhost:${PORT}`);
});
