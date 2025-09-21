import React from "react";
import Modal from "./Modal";
import { useRoomContext } from "../context/RoomContext";

export default function RoomModal() {
  const { showModal, setShowModal, createRoom } = useRoomContext();

  if (!showModal) return null;

  return (
    <Modal closeable={false} onClose={() => setShowModal(false)}>
      <h2 className="text-lg font-bold text-gray-900 mb-4">
        Room doesn’t exist
      </h2>
      <p className="text-sm text-gray-600 mb-6">
        The room you’re trying to join was not found. Would you like to create a new one?
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
  );
}
