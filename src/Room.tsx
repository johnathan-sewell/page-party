// import { useState } from "react";
import usePartySocket from "partysocket/react";
import { useParams } from "react-router-dom";
import { config } from "./config";
import { useEffect, useState } from "react";
import { Cursor } from "./Cursor";

type MouseData = {
  [key: string]: { x: number; y: number };
};

const myId = Math.random().toString(36).substring(2, 10);

export function Room() {
  const { roomId } = useParams();
  const [roomName, setRoomName] = useState<string | undefined>(undefined);
  const [roomColor, setRoomColor] = useState<string | undefined>(undefined);

  const [dimensions, setDimensions] = useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });

  const [mouseData, setMouseData] = useState<MouseData>();

  const socket = usePartySocket({
    host: config.PARTYKIT_URL,
    room: roomId,
    onMessage(event) {
      setMouseData(JSON.parse(event.data));
    },
  });

  // fetch room data
  useEffect(() => {
    const fetchRoom = async () => {
      const response = await fetch(`${config.PARTYKIT_URL}/party/${roomId}`);
      const data = await response.json();
      setRoomName(data.roomName);
      setRoomColor(data.roomColor);
    };

    fetchRoom();
  }, [roomId]);

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

  // track the mouse
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!socket) return;
      if (!dimensions.width || !dimensions.height) return;
      const mouseData: MouseData = {
        [myId]: {
          x: e.clientX / dimensions.width,
          y: e.clientY / dimensions.height,
        },
      };
      socket.send(JSON.stringify(mouseData));
    };
    window.addEventListener("mousemove", onMouseMove);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, [socket, dimensions]);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: roomColor,
        margin: 0,
        padding: 0,
      }}
    >
      <div>
        {roomName} ({roomId})
      </div>

      {mouseData &&
        Object.keys(mouseData).map((id) => (
          <Cursor
            key={id}
            id={id}
            cursor={mouseData[id]}
            windowDimensions={dimensions}
          />
        ))}
    </div>
  );
}
