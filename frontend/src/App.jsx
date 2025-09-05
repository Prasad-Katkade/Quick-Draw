import React, { useEffect, useState } from "react";
import { socket } from "./utils/socket";
import CanvasBoard from "./components/CanvasBoard";
import Header from "./components/Header";
import Modal from "./components/Modal";
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
  const [showModal, setShowModal] = useState(false);
  const [userCount, setUserCount] = useState(0); // initial 0

  useEffect(() => {
    // Listen for real-time user count updates
    socket.on("user-count", ({ roomId: rId, count }) => {
      if (rId === roomId) setUserCount(count);
    });

    // Handle room errors
    socket.on("room-error", ({ msg }) => {
      console.log("Room error:", msg);
      setShowModal(true);
    });

    return () => {
      socket.off("user-count");
      socket.off("room-error");
    };
  }, [roomId]);

  const createRoom = () => {
    const id = makeRoomId();
    setRoomId(id);
    socket.emit("join-room", { roomId: id, create: true });
  };

  const joinRoom = () => {
    const id = joinInput.trim().toUpperCase();
    if (!id) return;
    setRoomId(id);
    socket.emit("join-room", { roomId: id, create: false });
  };

  const exitRoom = () => {
    setRoomId("");
    setJoinInput("");
    setUserCount(0); // reset count when exiting
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
          userCount={userCount}
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

      {/* Modal for room doesn't exist */}
      {showModal && (
        <Modal closeable={false} onClose={() => setShowModal(false)}>
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Room doesn’t exist
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            The room you’re trying to join was not found. Would you like to
            create a new one?
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => {
                setShowModal(false);
                createRoom();
              }}
              className="px-4 py-2 rounded-md bg-blue-600 text-white font-semibold"
            >
              Create Room
            </button>
            
          </div>
        </Modal>
      )}
    </div>
  );
}
