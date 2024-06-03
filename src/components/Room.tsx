import usePartySocket from "partysocket/react";
import { config } from "../config";
import { CursorTracking } from "./CursorTracking/CursorTracking";
import { Chat } from "./Chat";

const ROOM_ID = "floof-party";

export function Room({ name }: { name: string }) {
  const socket = usePartySocket({
    host: config.PARTYKIT_URL,
    room: ROOM_ID,
    id: name,
    onMessage({ data }) {
      console.log(data);
    },
  });

  return (
    <>
      <div className="flex mx-1" style={{ height: "calc(100vh - 3rem)" }}>
        <Chat socket={socket} name={name} />
      </div>

      {name && <CursorTracking socket={socket} name={name} />}
    </>
  );
}
