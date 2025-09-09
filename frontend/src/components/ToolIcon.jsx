import React from "react";
import ToolDrawer from "./ToolDrawer";

export default function ToolIcon({ tool, isOpen, onClick, index, onClose }) {
    return (
        <div className="relative flex flex-col items-center">
            <div className={`p-0.5 ${isOpen ? "bg-gray-50  border border-gray-300 rounded-md" : "bg-white"} `}> <button
                onClick={onClick}
                className={`p-2 rounded ${isOpen ? "text-blue-600" : "text-gray-600"}`}
            >
                {tool.icon}
            </button></div>


            {/* Blue dot on top */}
            {isOpen && (
                <div className="absolute -top-3 w-2 h-2 bg-blue-600 rounded-full" />
            )}

            {/* Drawer */}
            {isOpen && tool.showDrawer && (
                <ToolDrawer toolName={tool.name} index={index} onClose={onClose} />
            )}
        </div>
    );
}
