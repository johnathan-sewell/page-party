import PartySocket from "partysocket";
import { useEffect, useState } from "react";
import { Cursors, EventType, MouseMoveEvent } from "../../party/types";
import { Cursor } from "./Cursor";

const myId = Math.random().toString(36).substring(2, 10);

export const CursorTracking = ({
  name,
  socket,
}: {
  name: string;
  socket: PartySocket;
}) => {
  const [mouseData, setMouseData] = useState<Cursors>();

  const handleMessage = (event: MessageEvent) => {
    const data = JSON.parse(event.data) as EventType;
    if (data.type === "mouse") {
      setMouseData(data.payload);
    }
  };

  useEffect(() => {
    socket.addEventListener("message", handleMessage);
    return () => {
      socket.removeEventListener("message", handleMessage);
    };
  }, [socket]);

  const [dimensions, setDimensions] = useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });

  // track the mouse
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!socket) return;
      if (!dimensions.width || !dimensions.height) return;
      const data: MouseMoveEvent = {
        type: "mouse",
        payload: {
          [myId]: {
            name,
            x: e.clientX / dimensions.width,
            y: e.clientY / dimensions.height,
          },
        },
      };
      socket.send(JSON.stringify(data));
    };
    window.addEventListener("mousemove", onMouseMove);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, [name, socket, dimensions]);

  // track window dimensions
  useEffect(() => {
    const onResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", onResize);
    onResize();
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div className="w-lvw h-lvh absolute left-0 top-0 -z-50">
      {mouseData &&
        Object.keys(mouseData).map((id) => (
          <Cursor
            key={id}
            cursor={mouseData[id]}
            windowDimensions={dimensions}
          />
        ))}
    </div>
  );
};
