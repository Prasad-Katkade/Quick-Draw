import React, { useEffect, useRef } from "react";
import { useCanvasPointer } from "../hooks/canvas/useCanvasPointer";
import { useCanvasRef } from "../hooks/canvas/useCanvasRef";
import { useDrawing } from "../hooks/canvas/useDrawing";
import { useCanvasSocket } from "../hooks/canvas/useCanvasSocket";
import { useCanvasGrid } from "../hooks/canvas/useCanvasGrid";
import { useToolContext } from "../context/ToolContext";
import { useRoomContext } from "../context/RoomContext";
import { CANVAS_SIZE } from "../constants/constants";



export default function CanvasBoard() {
  const containerRef = useRef(null);
  const { roomId } = useRoomContext();
  const { canvasRef, ctxRef, strokesRef } = useCanvasRef();
  const { activeTool, activeSubTool } = useToolContext();
  const { isDrawing, start, drawTo, end } = useDrawing(ctxRef, strokesRef, roomId);
  const { initCanvas } = useCanvasGrid(canvasRef, ctxRef);
  const autoScroll = true; // toggle for auto-scroll feature
 
  useCanvasSocket(ctxRef, strokesRef, roomId,autoScroll);
  useCanvasPointer(canvasRef, containerRef, start, drawTo, end, isDrawing, autoScroll);

  useEffect(() => { initCanvas(); }, []);
  useEffect(() => {
    console.log("Active tool:", activeTool);
    console.log("Active sub-tool:", activeSubTool);
  }, [activeTool, activeSubTool]);

  return (
    <div ref={containerRef} className="w-screen h-screen overflow-scroll bg-white">
      <canvas ref={canvasRef} width={CANVAS_SIZE} height={CANVAS_SIZE} />
    </div>
  );
}
