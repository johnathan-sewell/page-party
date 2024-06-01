import usePartySocket from "partysocket/react";
import { config } from "./config";
import { CursorTracking } from "./CursorTracking/CursorTracking";
import { useState } from "react";
import { Chat } from "./Chat";

const ROOM_ID = "floof-party";

const useNameForm = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const [name, setName] = useState<string>();

  const nameForm = (
    <form className="flex flex-col items-center">
      <input
        className="w-1/2 border border-black rounded p-2"
        type="text"
        value={inputValue}
        placeholder="Who are you?"
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button
        className="disabled: mt-4 enabled:bg-pink-700 disabled:bg-slate-400 enabled:hover:bg-pink-500 text-white font-bold py-2 px-4 rounded uppercase"
        disabled={!inputValue}
        onClick={() => {
          setName(inputValue);
        }}
      >
        Let's go!
      </button>
    </form>
  );

  return {
    name,
    nameForm,
  };
};

const Nav = () => (
  <nav className="bg-black w-full flex justify-center h-10 mb-1">
    <div className="prose">
      <h1 className="text-center uppercase text-white">
        Page <em className="text-pink-500">Party</em>
      </h1>
    </div>
  </nav>
);

export function Lobby() {
  const { name, nameForm } = useNameForm();

  return (
    <>
      <Nav />
      {!name && nameForm}
      {name && <Room name={name} />}
    </>
  );
}

export function Room({ name }: { name: string }) {
  const socket = usePartySocket({
    host: config.PARTYKIT_URL,
    room: ROOM_ID,
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
