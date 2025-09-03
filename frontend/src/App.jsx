import React, { useEffect, useState } from "react";
import { socket } from "./utils/socket";
import CanvasBoard from "./components/CanvasBoard";

function makeRoomId(len = 5) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: len }, () =>
    alphabet[Math.floor(Math.random() * alphabet.length)]
  ).join("");
}

export default function App() {
  const [roomId, setRoomId] = useState("");
  const [status, setStatus] = useState("create a room");
  const [joinInput, setJoinInput] = useState("");

  useEffect(() => {
    const onJoined = ({ roomId }) => setStatus(`joined room - ${roomId}`);
    socket.on("joined", onJoined);
    return () => socket.off("joined", onJoined);
  }, []);

  const createRoom = () => {
    const id = makeRoomId();
    setRoomId(id);
    socket.emit("join-room", { roomId: id });
  };

  const joinRoom = () => {
    const id = joinInput.trim().toUpperCase();
    if (!id) return;
    setRoomId(id);
    socket.emit("join-room", { roomId: id });
  };

  const clearRoom = () => {
    if (!roomId) return;
    socket.emit("clear", { roomId });
  };

  useEffect(() => {
    setStatus(roomId ? `joined room - ${roomId}` : "create a room");
  }, [roomId]);

  return (
    <div className="w-screen h-screen bg-neutral-900 text-white relative">
      {/* Top bar controls */}
      <div className="absolute top-0 left-0 right-0 z-20 p-3 flex gap-2 items-center bg-black/40 backdrop-blur-sm">
        <h1 className="font-semibold text-sm sm:text-base grow">
          {status}
        </h1>
        <button
          onClick={createRoom}
          className="px-3 py-2 rounded bg-emerald-500 hover:bg-emerald-600 text-black text-sm font-semibold"
          title="Create a new room with a short id"
        >
          Create Room
        </button>
        <input
          value={joinInput}
          onChange={(e) => setJoinInput(e.target.value)}
          placeholder="Enter room ID"
          className="px-3 py-2 rounded bg-white text-black w-28 sm:w-40 text-sm"
        />
        <button
          onClick={joinRoom}
          className="px-3 py-2 rounded bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold"
        >
          Join
        </button>
        <button
          onClick={clearRoom}
          className="px-3 py-2 rounded bg-rose-500 hover:bg-rose-600 text-white text-sm font-semibold"
          disabled={!roomId}
          title="Clear canvas for everyone in the room"
        >
          Clear
        </button>
      </div>

      {/* Fullscreen canvas */}
      <CanvasBoard roomId={roomId} />
    </div>
  );
}
