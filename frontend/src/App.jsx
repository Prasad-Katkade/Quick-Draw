import React, { useEffect, useState } from "react";
import { socket } from "./utils/socket";
import CanvasBoard from "./components/CanvasBoard";
import Header from "./components/Header";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/solid";

function makeRoomId(len = 5) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: len }, () =>
    alphabet[Math.floor(Math.random() * alphabet.length)]
  ).join("");
}

export default function App() {
  const [roomId, setRoomId] = useState("");
  const [joinInput, setJoinInput] = useState("");
  const [showHeader, setShowHeader] = useState(true);

  useEffect(() => {
    const onJoined = ({ roomId }) => {};
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

  const exitRoom = () => {
    setRoomId("");
    setJoinInput("");
  };

  return (
    <div className="w-screen h-screen bg-neutral-900 text-white relative">
      {/* Floating header */}
      {showHeader && (
        <Header
          roomId={roomId}
          joinInput={joinInput}
          setJoinInput={setJoinInput}
          createRoom={createRoom}
          joinRoom={joinRoom}
          exitRoom={exitRoom}
          setShowHeader={setShowHeader}
        />
      )}

      {/* Toggle button when header hidden */}
      {!showHeader && (
        <button
          onClick={() => setShowHeader(true)}
          className="absolute top-4 right-4 z-20 w-12 h-12 flex items-center justify-center rounded-full bg-white border border-gray-300 shadow-md"
        >
          <EllipsisHorizontalIcon className="w-6 h-6 text-blue-600" />
        </button>
      )}

      {/* Fullscreen canvas */}
      <CanvasBoard roomId={roomId} />
    </div>
  );
}
