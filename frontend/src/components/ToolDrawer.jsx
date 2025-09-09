import React, { useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEraser, faTrash } from "@fortawesome/free-solid-svg-icons";
import { socket } from "../utils/socket";

const toolOptions = {
    eraser: [
        { 
            name: "Erase", 
            icon: <FontAwesomeIcon icon={faEraser} className="text-gray-500" />, 
            onClick: () => console.log("Erase clicked") 
        },
        { 
            name: "Clear all", 
            icon: <FontAwesomeIcon icon={faTrash} className="text-gray-500" />, 
            onClick: () => clearAll()
        },
    ],
    pen: [
        { name: "thin", icon: "T", onClick: () => console.log("thin clicked") },
        { name: "thick", icon: "K", onClick: () => console.log("thick clicked") },
    ],
};
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

    

    return (
        <div
            ref={drawerRef}
            className={`absolute bottom-full mb-10 left-1/2 transform -translate-x-1/2 bg-white rounded-md shadow-lg 
                 p-2 flex flex-col z-50 overflow-y-auto border border-gray-300
                 w-max max-w-[300px] ${index === 0 ? "ml-[30px]" : ""}`}
        >
            {options.map((opt, idx) => (
                <div
                    key={opt.name}
                    onClick={opt.onClick}
                    className={`flex text-gray-800 flex-row items-center gap-2 p-1 hover:text-blue-600 cursor-pointer whitespace-nowrap
      ${idx !== options.length - 1 ? "border-b border-gray-200" : ""}`}
                >
                    <span className="text-lg">{opt.icon}</span>
                    <span>{opt.name}</span>
                </div>
            ))}
        </div>
    );
}
