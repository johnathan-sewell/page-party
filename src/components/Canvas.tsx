import PartySocket from "partysocket";
import { useEffect, useRef, useState } from "react";
import { Cursors, EventType } from "../../party/types";

const randomHexColorCode = () =>
  "#" + (Math.random() * 0xfffff * 1000000).toString(16).slice(0, 6);

const myColor = randomHexColorCode();

const drawLine = ({
  ctx,
  from,
  to,
  dimensions,
  color = randomHexColorCode(),
}: {
  ctx?: CanvasRenderingContext2D | null;
  from?: { x: number; y: number };
  to?: { x: number; y: number };
  dimensions?: { width: number; height: number };
  color?: string;
}) => {
  if (!ctx || !from || !to) return;
  const dimensionsWidth = dimensions?.width ?? 1;
  const dimensionsHeight = dimensions?.height ?? 1;

  console.log("drawing line", from, to, color);
  ctx.beginPath();
  ctx.moveTo(from.x * dimensionsWidth, from.y * dimensionsHeight);
  ctx.lineTo(to.x * dimensionsWidth, to.y * dimensionsHeight);
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.closePath();
};

export const Canvas = ({
  name,
  socket,
}: {
  name: string;
  socket: PartySocket;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvas = canvasRef.current;
  const ctx = canvas?.getContext("2d");

  const previousCursors = useRef<Cursors>({});
  const myPreviousMouse = useRef<{ x: number; y: number }>();
  const colors = useRef<{ [key: string]: string }>({});

  const [dimensions, setDimensions] = useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });

  // draw lines from other cursors
  useEffect(() => {
    const drawLines = (event: MessageEvent) => {
      const data = JSON.parse(event.data) as EventType;
      if (data.type === "mouse") {
        Object.keys(data.payload).forEach((id) => {
          if (colors.current && colors.current?.[id] === undefined) {
            colors.current[id] = randomHexColorCode();
          }
          if (data.payload[id].buttons === 1) {
            drawLine({
              ctx,
              from: previousCursors?.current?.[id],
              to: data.payload[id],
              dimensions,
              color: colors.current?.[id],
            });
          }

          previousCursors.current[id] = data.payload[id];
        });
      }
    };
    socket.addEventListener("message", drawLines);
    return () => {
      socket.removeEventListener("message", drawLines);
    };
  }, [socket, ctx, dimensions]);

  // draw lines from my cursor
  useEffect(() => {
    const drawMyMouseMoves = (e: MouseEvent) => {
      if (e.buttons === 1) {
        drawLine({
          ctx,
          from: myPreviousMouse.current,
          to: { x: e.clientX, y: e.clientY },
          color: myColor,
        });
      }
      myPreviousMouse.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener("mousemove", drawMyMouseMoves);

    return () => {
      window.removeEventListener("mousemove", drawMyMouseMoves);
    };
  }, [name, socket, dimensions, ctx]);

  // track window dimensions
  useEffect(() => {
    const onResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };

    onResize();

    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, [canvas]);

  return (
    <canvas
      ref={canvasRef}
      height="100%"
      width="100%"
      className="absolute top-0 left-0 -z-10"
    ></canvas>
  );
};
