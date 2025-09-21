export const useCanvasGrid = (canvasRef, ctxRef, CANVAS_SIZE = 5000) => {
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

  return { initCanvas };
};
