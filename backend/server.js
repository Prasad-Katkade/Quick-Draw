import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors({ origin: "*" }));

app.get("/", (_, res) => res.send("QuickDraw server is running"));

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

io.on("connection", (socket) => {
  const emitUserCount = (roomId) => {
    const count = io.sockets.adapter.rooms.get(roomId)?.size || 0;
    io.to(roomId).emit("user-count", { roomId, count });
  };

  socket.on("join-room", ({ roomId, create }) => {
    const rooms = io.sockets.adapter.rooms;
    const roomExists = rooms.has(roomId);

    if (!roomExists && !create) {
      socket.emit("room-error", { success: false, msg: "Room doesn't exist" });
      return;
    }

    socket.join(roomId);
    socket.data.roomId = roomId;

    socket.emit("joined", { roomId });
    socket.to(roomId).emit("peer-joined", { id: socket.id });

    // ✅ Update user count for everyone in room
    emitUserCount(roomId);
  });

  socket.on("disconnect", () => {
    const roomId = socket.data?.roomId;
    if (roomId) {
      socket.to(roomId).emit("peer-left", { id: socket.id });

      // ✅ Update user count for everyone in room
      emitUserCount(roomId);

      // Remove room if empty
      const count = io.sockets.adapter.rooms.get(roomId)?.size || 0;
      if (count === 0) {
        console.log(`Room ${roomId} is empty, closing it`);
        io.sockets.adapter.rooms.delete(roomId);
      }
    }
  });

  // Other events like draw/clear remain the same
});




const PORT = 4000;
server.listen(PORT, () => {
  console.log(`QuickDraw server listening on http://localhost:${PORT}`);
});
