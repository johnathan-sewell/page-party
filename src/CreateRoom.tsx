import { useState } from "react";
import { config } from "./config";
import { useNavigate } from "react-router-dom";

const randomId = () => Math.random().toString(36).substring(2, 10);

export function CreateRoom() {
  const navigate = useNavigate();
  const [isWorking, setIsWorking] = useState(false);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <input type="text" id="name" placeholder="Room Name" />

      <button
        disabled={isWorking}
        onClick={async () => {
          setIsWorking(true);
          const roomId = randomId();
          await fetch(`${config.PARTYKIT_URL}/party/${roomId}`, {
            method: "POST",
            body: JSON.stringify({
              name: (document.getElementById("name") as HTMLInputElement).value,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          });
          navigate(`/${roomId}`);
        }}
      >
        Create Room
      </button>
    </div>
  );
}
