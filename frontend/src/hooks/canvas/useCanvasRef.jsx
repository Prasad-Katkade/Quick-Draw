import { useRef } from "react";

export const useCanvasRef = () => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const strokesRef = useRef({});
  return { canvasRef, ctxRef, strokesRef };
};
