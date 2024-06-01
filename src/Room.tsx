import usePartySocket from "partysocket/react";
import { config } from "./config";
import { CursorTracking } from "./CursorTracking/CursorTracking";
import { useState } from "react";

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

export function Room() {
  const { name, nameForm } = useNameForm();

  const socket = usePartySocket({
    host: config.PARTYKIT_URL,
    room: ROOM_ID,
    onMessage({ data }) {
      console.log(data);
    },
  });

  return (
    <>
      <div className="prose grow flex flex-col m-auto">
        <h1 className="text-center mt-8 uppercase text-stone-800">
          Page <em className="text-pink-500">Party</em>
        </h1>
        {!name && nameForm}
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
      </div>
      {name && <CursorTracking socket={socket} name={name} />}
    </>
  );
}
