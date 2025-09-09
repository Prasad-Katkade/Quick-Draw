import React, { useState } from "react";
import ToolIcon from "./ToolIcon";
import { EllipsisHorizontalCircleIcon } from "@heroicons/react/24/solid";

const toolsData = [
    { name: "eraser", icon: <span> E </span>, showDrawer: true },
    { name: "pen", icon: <span> P </span>, showDrawer: true },
    { name: "marker", icon: <span> M </span>, showDrawer: true },
];

export default function DrawingTools() {
    const [openDrawer, setOpenDrawer] = useState(null);

    const handleClick = (toolName, showDrawer) => {
        console.log(toolName);
        if (showDrawer) setOpenDrawer(openDrawer === toolName ? null : toolName);
    };
    const handleClose = () => {
        setOpenDrawer(null);
    };

    return (
        <div
            className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white shadow-lg border border-gray-300 rounded-md p-2 z-50 
                 w-[calc(100%-20px)] md:w-[600px] flex flex-row justify-between"
        >
            <div className="flex-1 flex gap-2">
                {toolsData.map((tool, index) => (
                    <ToolIcon
                        key={tool.name}
                        tool={tool}
                        isOpen={openDrawer === tool.name}
                        onClick={() => handleClick(tool.name, tool.showDrawer)}
                        onClose={() => handleClose()}
                        index={index}
                    />
                ))}
            </div>
            <div className="flex items-center">
                <EllipsisHorizontalCircleIcon className="w-6 h-6 text-gray-600" />
            </div>
        </div>
    );
}
