import React, { useState } from "react";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/solid";
import { ToolProvider } from "./context/ToolContext";
import { RoomProvider } from "./context/RoomContext";
import Header from "./components/Header";
import CanvasBoard from "./components/CanvasBoard";
import DrawingTools from "./components/DrawingTools";
import RoomModal from "./components/RoomModal";

export default function App() {
  const [showHeader, setShowHeader] = useState(true);

  return (
    <RoomProvider>
      <ToolProvider>
        <div className="w-screen h-screen bg-neutral-900 text-white relative">
          {/* Floating header */}
          {showHeader && <Header setShowHeader={setShowHeader} />}
          {!showHeader && (
            <button
              onClick={() => setShowHeader(true)}
              className="absolute top-4 right-4 z-20 w-12 h-12 flex items-center justify-center rounded-full bg-white border border-gray-300 shadow-md"
            >
              <EllipsisHorizontalIcon className="w-6 h-6 text-blue-600" />
            </button>
          )}

          {/* Fullscreen canvas */}
          <CanvasBoard />

          {/* Drawing Tools */}
          <DrawingTools />

          {/* Room modal */}
          <RoomModal />
        </div>
      </ToolProvider>
    </RoomProvider>
  );
}
