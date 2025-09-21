import React, { createContext, useContext, useEffect, useState } from "react";
import { socket } from "../utils/socket";

const RoomContext = createContext();

export function RoomProvider({ children }) {
  const [roomId, setRoomId] = useState("");
  const [joinInput, setJoinInput] = useState("");
  const [userCount, setUserCount] = useState(0);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    socket.on("user-count", ({ roomId: rId, count }) => {
      if (rId === roomId) setUserCount(count);
    });

    socket.on("room-error", ({ msg }) => {
      console.log("Room error:", msg);
      setShowModal(true);
    });

    return () => {
      socket.off("user-count");
      socket.off("room-error");
    };
  }, [roomId]);

  const makeRoomId = (len = 5) => {
    const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    return Array.from({ length: len }, () =>
      alphabet[Math.floor(Math.random() * alphabet.length)]
    ).join("");
  };

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
    setUserCount(0);
  };

  return (
    <RoomContext.Provider
      value={{
        roomId,
        joinInput,
        setJoinInput,
        userCount,
        showModal,
        setShowModal,
        createRoom,
        joinRoom,
        exitRoom,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useRoomContext = () => useContext(RoomContext);
