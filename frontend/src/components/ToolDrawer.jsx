// toolDrawer.jsx
import React, { useEffect, useRef } from "react";
import { socket } from "../utils/socket"; // <-- make sure this path is correct

const toolOptions = {
  eraser: [
    { name: "Erase", icon: "E", onClick: () => console.log("Erase clicked") },
    { name: "Clear all", icon: "C", onClick: () => clearAll() },
  ],
  pen: [
    { name: "thin", icon: "T", onClick: () => console.log("thin clicked") },
    { name: "thick", icon: "K", onClick: () => console.log("thick clicked") },
  ],
};

// define clearAll in this file
function clearAll() {
  console.log("Clear All clicked (client)"); // check browser console
  // emit without payload — server will use socket.data.roomId
  socket.emit("clear");
}

export default function ToolDrawer({ toolName, index, onClose }) {
  const options = toolOptions[toolName] || [];
  const drawerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (drawerRef.current && !drawerRef.current.contains(e.target)) {
        onClose?.();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleOptionClick = (opt) => {
    // call the option handler if present, then close drawer
    try {
      opt?.onClick?.();
    } catch (err) {
      console.error("option click error:", err);
    }
    onClose?.();
  };

  return (
    <div
      ref={drawerRef}
      className={`absolute bottom-full mb-10 left-1/2 transform -translate-x-1/2 bg-white rounded-md shadow-lg 
                 p-2 flex flex-col z-50 overflow-y-auto border border-gray-300
                 max-w-[calc(100vw-40px)] md:max-w-[300px] ${index === 0 ? "ml-[30px]" : ""}`}
    >
      {options.map((opt, idx) => (
        <div
          key={opt.name}
          onClick={() => handleOptionClick(opt)}
          className={`flex text-black items-center gap-2 p-1 hover:text-blue-600 cursor-pointer break-words
      ${idx !== options.length - 1 ? "border-b border-gray-200" : ""}`}
        >
          <span>{opt.icon}</span>
          <span>{opt.name}</span>
        </div>
      ))}
    </div>
  );
}
