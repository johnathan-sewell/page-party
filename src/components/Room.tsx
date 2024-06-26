import usePartySocket from "partysocket/react";
import { config } from "../config";
import { CursorTracking } from "./CursorTracking/CursorTracking";
import { Chat } from "./Chat";
import { Canvas } from "./Canvas";

const ROOM_ID = "floof-party";

export function Room({ name }: { name: string }) {
  const socket = usePartySocket({
    host: config.PARTYKIT_URL,
    room: ROOM_ID,
    id: name,
  });

  return (
    <>
      <div className="flex mx-1" style={{ height: "calc(100vh - 3rem)" }}>
        <Chat socket={socket} name={name} />
      </div>

      {name && (
        <>
          <CursorTracking socket={socket} name={name} />
          <Canvas name={name} socket={socket} />
        </>
      )}
    </>
  );
}
