import React, { useEffect, useRef, useState } from "react";
import { socket } from "../utils/socket";

const uid = () => Math.random().toString(36).slice(2);

export default function CanvasBoard({ roomId }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const lastPoint = useRef(null);
  const strokeIdRef = useRef(null);

  const CANVAS_SIZE = 5000;

  // --- initialize canvas with permanent grid ---
  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // light gray grid
    ctx.strokeStyle = "#e5e5e5";
    ctx.lineWidth = 1;
    for (let x = 0; x < CANVAS_SIZE; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, CANVAS_SIZE);
      ctx.stroke();
    }
    for (let y = 0; y < CANVAS_SIZE; y += 50) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(CANVAS_SIZE, y);
      ctx.stroke();
    }

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 4;

    ctxRef.current = ctx;
  };

  useEffect(() => {
    initCanvas();
  }, []);

  // --- drawing functions ---
  const start = (x, y) => {
    setIsDrawing(true);
    lastPoint.current = { x, y };
    strokeIdRef.current = uid();
    scrollToPoint(x, y);
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

    if (roomId) {
      socket.emit("draw", {
        roomId,
        strokeId: strokeIdRef.current,
        color: "#000000",
        lineWidth: 4,
        segments: [p0, p1],
      });
    }

    lastPoint.current = p1;
    scrollToPoint(p1.x, p1.y);
  };

  const end = () => {
    setIsDrawing(false);
    lastPoint.current = null;
    strokeIdRef.current = null;
  };

  // --- auto-scroll ---
  const scrollToPoint = (x, y) => {
    const container = containerRef.current;
    if (!container) return;
    const buffer = 100;
    const { scrollLeft, scrollTop, clientWidth, clientHeight } = container;

    if (
      x < scrollLeft + buffer ||
      x > scrollLeft + clientWidth - buffer ||
      y < scrollTop + buffer ||
      y > scrollTop + clientHeight - buffer
    ) {
      container.scrollTo({
        left: x - clientWidth / 2,
        top: y - clientHeight / 2,
        behavior: "smooth",
      });
    }
  };

  // --- pointer and touch handlers ---
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    container.style.touchAction = "none"; // disable browser pinch-zoom & scroll

    let lastMid = null;

    const toXY = (e) => {
      const rect = canvas.getBoundingClientRect();
      if (e.touches?.length) {
        return {
          x: e.touches[0].clientX - rect.left,
          y: e.touches[0].clientY - rect.top,
        };
      } else {
        return {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        };
      }
    };

    const getMid = (touches) => ({
      x: (touches[0].clientX + touches[1].clientX) / 2,
      y: (touches[0].clientY + touches[1].clientY) / 2,
    });

    const onDown = (e) => {
      if (e.touches?.length === 1) {
        const { x, y } = toXY(e);
        start(x, y);
      } else if (e.touches?.length === 2) {
        lastMid = getMid(e.touches);
      }
    };

    const onMove = (e) => {
      if (e.touches?.length === 1 && isDrawing) {
        const { x, y } = toXY(e);
        drawTo(x, y);
      } else if (e.touches?.length === 2) {
        e.preventDefault(); // prevent browser pinch zoom

        // two-finger pan
        const currMid = getMid(e.touches);
        const dx = lastMid.x - currMid.x;
        const dy = lastMid.y - currMid.y;
        container.scrollLeft += dx;
        container.scrollTop += dy;
        lastMid = currMid;
      }
    };

    const onUp = (e) => {
      if (isDrawing) end();
      if (!e.touches || e.touches.length < 2) lastMid = null;
    };

    // Mouse
    canvas.addEventListener("mousedown", (e) => start(toXY(e).x, toXY(e).y));
    window.addEventListener("mousemove", (e) => {
      if (isDrawing) drawTo(toXY(e).x, toXY(e).y);
    });
    window.addEventListener("mouseup", end);

    // Touch
    canvas.addEventListener("touchstart", onDown, { passive: false });
    canvas.addEventListener("touchmove", onMove, { passive: false });
    canvas.addEventListener("touchend", onUp, { passive: false });
    canvas.addEventListener("touchcancel", onUp, { passive: false });

    return () => {
      canvas.removeEventListener("touchstart", onDown);
      canvas.removeEventListener("touchmove", onMove);
      canvas.removeEventListener("touchend", onUp);
      canvas.removeEventListener("touchcancel", onUp);
    };
  }, [isDrawing]);

  // --- handle incoming strokes ---
  useEffect(() => {
    const onDraw = (payload) => {
      const { segments, color, lineWidth } = payload;
      const ctx = ctxRef.current;
      if (!ctx || !segments?.length) return;

      ctx.save();
      ctx.strokeStyle = color || "#000000";
      ctx.lineWidth = lineWidth || 4;
      ctx.beginPath();
      ctx.moveTo(segments[0].x, segments[0].y);
      ctx.lineTo(segments[1].x, segments[1].y);
      ctx.stroke();
      ctx.restore();

      scrollToPoint(segments[1].x, segments[1].y);
    };

    socket.on("draw", onDraw);
    return () => socket.off("draw", onDraw);
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-screen h-screen overflow-scroll bg-white"
    >
      <canvas
        ref={canvasRef}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        className="block"
      />
    </div>
  );
}
