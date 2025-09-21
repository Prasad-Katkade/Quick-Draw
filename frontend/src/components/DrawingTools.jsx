import React, { useState } from "react";
import { EllipsisHorizontalCircleIcon } from "@heroicons/react/24/solid";
import Tools from "./Tools";
import { TOOLS } from "../constants/ToolsList"; // adjust path

export default function DrawingTools({ onToolChange }) {
  const [openDrawer, setOpenDrawer] = useState(null);

  const handleClick = (toolName, showDrawer) => {
    if (showDrawer) setOpenDrawer(openDrawer === toolName ? null : toolName);
    onToolChange?.(toolName); // notify parent (CanvasBoard) about active tool
  };

  const handleClose = () => setOpenDrawer(null);


  return (
    <div
      className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white shadow-lg border border-gray-300 rounded-md p-2 z-50 
                 w-[calc(100%-20px)] md:w-[600px] flex flex-row justify-between"
    >
      <div className="flex-1 flex gap-2">
        {TOOLS.map((tool, index) => (
          <Tools
            key={tool.name}
            tool={tool}
            isOpen={openDrawer === tool.name}
            onClick={() => handleClick(tool.name, tool.showDrawer)}
            onClose={handleClose}
            index={index}
          />
        ))}
      </div>
      <div className="flex items-center cursor-pointer">
        <EllipsisHorizontalCircleIcon className="w-6 h-6 text-gray-600" />
      </div>
    </div>
  );
}
