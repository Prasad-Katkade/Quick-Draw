import { useEffect } from "react";
import { socket } from "../../utils/socket";
import { CANVAS_SIZE } from "../../constants/constants";

export const useCanvasSocket = (ctxRef, strokesRef, roomId, autoScroll = true) => {
  useEffect(() => {
    if (!roomId) return;

    const scrollToPoint = (x, y) => {
      if (!autoScroll) return;
      const container = ctxRef.current?.canvas?.parentElement; // assuming container ref
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

    const onDraw = (payload) => {
      const { segments, color, lineWidth, userId } = payload;
      const ctx = ctxRef.current;
      if (!ctx || !segments?.length) return;

      const uid = userId || "remote";
      if (!strokesRef.current[uid]) strokesRef.current[uid] = [];
      strokesRef.current[uid].push({ segments, color, lineWidth });

      // draw the segment
      ctx.save();
      ctx.strokeStyle = color || "#000000";
      ctx.lineWidth = lineWidth || 4;
      ctx.beginPath();
      ctx.moveTo(segments[0].x, segments[0].y);
      ctx.lineTo(segments[1].x, segments[1].y);
      ctx.stroke();
      ctx.restore();

      // scroll container to the last segment
      scrollToPoint(segments[1].x, segments[1].y);
    };

    const onClear = ({ userId }) => {
      delete strokesRef.current[userId];
      const ctx = ctxRef.current;
      if (!ctx) return;
      ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
      drawGrid(ctx);
      // redraw all strokes
      Object.values(strokesRef.current).forEach((userStrokes) => {
        userStrokes.forEach((stroke) => {
          const s = stroke.segments;
          if (!s || s.length < 2) return;
          ctx.save();
          ctx.strokeStyle = stroke.color || "#000000";
          ctx.lineWidth = stroke.lineWidth || 4;
          ctx.beginPath();
          ctx.moveTo(s[0].x, s[0].y);
          ctx.lineTo(s[1].x, s[1].y);
          ctx.stroke();
          ctx.restore();
        });
      });
    };

    const drawGrid = (ctx) => {
  ctx.fillStyle = "#ffffff"; // optional background
  ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

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
  ctx.strokeStyle = "#000000"; // default drawing color
  ctx.lineWidth = 4;
};

    socket.on("draw", onDraw);
    socket.on("clear", onClear);

    return () => {
      socket.off("draw", onDraw);
      socket.off("clear", onClear);
    };
  }, [ctxRef, strokesRef, roomId, autoScroll]);
};
