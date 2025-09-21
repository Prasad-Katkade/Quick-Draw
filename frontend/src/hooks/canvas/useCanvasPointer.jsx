import { useEffect, useRef } from "react";

export const useCanvasPointer = (canvasRef, containerRef, start, drawTo, end, isDrawing,autoScroll) => {
  const lastMid = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    container.style.touchAction = "none";

    const toXY = (e) => {
      const rect = canvas.getBoundingClientRect();
      if (e.touches?.length) {
        return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
      } else {
        return { x: e.clientX - rect.left, y: e.clientY - rect.top };
      }
    };

    const getMid = (touches) => ({
      x: (touches[0].clientX + touches[1].clientX) / 2,
      y: (touches[0].clientY + touches[1].clientY) / 2,
    });

    const scrollToPoint = (x, y) => {
    if (!autoScroll) return; // respect toggle
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

    const onDown = (e) => {
      if (e.touches?.length === 1) {
        const { x, y } = toXY(e);
        start(x, y);
        scrollToPoint(x, y);
      } else if (e.touches?.length === 2) {
        lastMid.current = getMid(e.touches);
      } else if (e.button === 0) {
        const { x, y } = toXY(e);
        start(x, y);
        scrollToPoint(x, y);
      }
    };

    const onMove = (e) => {
      if (e.touches?.length === 1 && isDrawing) {
        const { x, y } = toXY(e);
        drawTo(x, y);
        scrollToPoint(x, y);
      } else if (e.touches?.length === 2) {
        e.preventDefault();
        const currMid = getMid(e.touches);
        const dx = lastMid.current.x - currMid.x;
        const dy = lastMid.current.y - currMid.y;
        container.scrollLeft += dx;
        container.scrollTop += dy;
        lastMid.current = currMid;
      }
    };

    const onUp = (e) => {
      if (isDrawing) end();
      if (!e.touches || e.touches.length < 2) lastMid.current = null;
    };

    

    // Mouse
    canvas.addEventListener("mousedown", onDown);
    window.addEventListener("mousemove", (e) => { if (isDrawing) drawTo(toXY(e).x, toXY(e).y); });
    window.addEventListener("mouseup", onUp);

    // Touch
    canvas.addEventListener("touchstart", onDown, { passive: false });
    canvas.addEventListener("touchmove", onMove, { passive: false });
    canvas.addEventListener("touchend", onUp, { passive: false });
    canvas.addEventListener("touchcancel", onUp, { passive: false });

    return () => {
      canvas.removeEventListener("mousedown", onDown);
      window.removeEventListener("mousemove", (e) => { if (isDrawing) drawTo(toXY(e).x, toXY(e).y); });
      window.removeEventListener("mouseup", onUp);

      canvas.removeEventListener("touchstart", onDown);
      canvas.removeEventListener("touchmove", onMove);
      canvas.removeEventListener("touchend", onUp);
      canvas.removeEventListener("touchcancel", onUp);
    };
  }, [canvasRef, containerRef, start, drawTo, end, isDrawing]);
};
