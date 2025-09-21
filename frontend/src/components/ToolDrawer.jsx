import React, { useEffect, useRef } from "react";
import { clearAll } from "../utils/canvasFns";
import { useRoomContext } from "../context/RoomContext";

export default function ToolDrawer({ subTools = [], index, onClose, onSubToolClick }) {
  const drawerRef = useRef(null);
  const {roomId}= useRoomContext();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target)) {
        onClose?.();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleClick = (name) => {
    console.log("SubTool clicked:", name);

    if (name === "Clear all") {
      clearAll(roomId); // pass the roomId to clearAll
    }

    // notify parent if needed
    onSubToolClick?.(name);
  };

  return (
    <div
      ref={drawerRef}
      className={`absolute bottom-full mb-10 left-1/2 transform -translate-x-1/2 bg-white rounded-md shadow-lg 
                  p-2 flex flex-col z-50 overflow-y-auto border border-gray-300 w-max max-w-[300px] 
                  ${index === 0 ? "ml-[30px]" : ""}`}
    >
      {subTools.map((opt) => (
        <div
          key={opt.name}
          onClick={() => handleClick(opt.name)}
          className="flex text-gray-800 flex-row items-center gap-2 p-1 hover:text-blue-600 cursor-pointer whitespace-nowrap"
        >
          <span className="text-lg">{opt.icon}</span>
          <span>{opt.name}</span>
        </div>
      ))}
    </div>
  );
}
