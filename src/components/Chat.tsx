import { useEffect, useState } from "react";
import { SendMessageEvent, EventType, ChatMessage } from "../party/types";
import PartySocket from "partysocket";

export const Chat = ({
  socket,
  name,
}: {
  socket: PartySocket;
  name: string;
}) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    // scroll to bottom
    const chat = document.querySelector("#messages");
    chat?.scrollTo(0, chat.scrollHeight);
  }, [messages]);

  const handleMessage = (event: MessageEvent) => {
    const data = JSON.parse(event.data) as EventType;
    if (data.type === "messages") {
      setMessages(data.payload);
    }
  };

  useEffect(() => {
    socket.addEventListener("message", handleMessage);
    return () => {
      socket.removeEventListener("message", handleMessage);
    };
  }, [socket]);

  return (
    <div className="flex flex-col">
      <div className="grow overflow-auto" id="messages">
        {messages.map((message, i) => (
          <div className="" key={i}>
            [{message.name}] {message.text}
          </div>
        ))}
      </div>
      <form className="flex">
        <input
          className="border border-black rounded py-2 px-4 mr-1 grow"
          type="text"
          value={inputValue}
          placeholder="Type a message..."
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button
          className="disabled: enabled:bg-pink-700 disabled:bg-slate-400 enabled:hover:bg-pink-500 text-white font-bold py-2 px-4 rounded uppercase"
          disabled={!inputValue}
          onClick={() => {
            const data: SendMessageEvent = {
              type: "sendMessage",
              payload: {
                name,
                text: inputValue,
              },
            };
            socket.send(JSON.stringify(data));
            setInputValue("");
          }}
        >
          Send
        </button>
      </form>
    </div>
  );
};
