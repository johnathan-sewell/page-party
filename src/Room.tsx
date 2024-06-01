import usePartySocket from "partysocket/react";
import { config } from "./config";
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

      {/* {name && (
          <div className="flex flex-col items-center">
            <button
              className="disabled: mt-4 enabled:bg-pink-700 disabled:bg-slate-400 enabled:hover:bg-pink-500 text-white font-bold py-2 px-4 rounded uppercase"
              onClick={() => {
                // setName(inputValue);
              }}
            >
              Play &apos;Who am I?&apos;
            </button>
          </div>
        )} */}
      {name && <CursorTracking socket={socket} name={name} />}
    </>
  );
}
