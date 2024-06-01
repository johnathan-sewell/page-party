import { useState } from "react";
import { Room } from "./Room";

const useNameForm = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const [name, setName] = useState<string>();

  const nameForm = (
    <form className="flex flex-col items-center h-lvh justify-center">
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

export function Lobby() {
  const { name, nameForm } = useNameForm();

  return (
    <>
      {!name && nameForm}
      {name && <Room name={name} />}
    </>
  );
}
