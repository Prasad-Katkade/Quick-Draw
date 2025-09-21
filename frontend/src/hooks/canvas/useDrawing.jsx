import { useState, useRef } from "react";
import { socket } from "../../utils/socket";

const uid = () => Math.random().toString(36).slice(2);

export const useDrawing = (ctxRef, strokesRef, roomId) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const lastPoint = useRef(null);
  const strokeIdRef = useRef(null);

  const start = (x, y) => {
    setIsDrawing(true);
    lastPoint.current = { x, y };
    strokeIdRef.current = uid();
  };

  const drawTo = (x, y) => {
    const ctx = ctxRef.current;
    if (!ctx || !isDrawing) return;

    const p0 = lastPoint.current;
    const p1 = { x, y };

    ctx.beginPath();
    ctx.moveTo(p0.x, p0.y);
    ctx.lineTo(p1.x, p1.y);
    ctx.stroke();

    // store locally
    const myId = socket.id || "local";
    if (!strokesRef.current[myId]) strokesRef.current[myId] = [];
    strokesRef.current[myId].push({ segments: [p0, p1], color: "#000000", lineWidth: 4 });

    if (roomId) {
      socket.emit("draw", {
        roomId,
        strokeId: strokeIdRef.current,
        color: "#000000",
        lineWidth: 4,
        segments: [p0, p1],
        userId: myId,
      });
    }

    lastPoint.current = p1;
  };

  const end = () => {
    setIsDrawing(false);
    lastPoint.current = null;
    strokeIdRef.current = null;
  };

  return { isDrawing, start, drawTo, end, setIsDrawing };
};
