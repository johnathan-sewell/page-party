// import { useState } from "react";
import usePartySocket from "partysocket/react";
import { useNavigate, useParams } from "react-router-dom";
import { config } from "./config";
import { useEffect, useState } from "react";
import {
  AnswerEvent,
  CountdownEvent,
  Cursors,
  GameOverEvent,
  MouseMoveEvent,
  Participant,
  ParticipantReadyEvent,
  ParticipantsEvent,
  Question,
  QuestionEvent,
  StartEvent,
} from "../party/types";
import { Cursor } from "./CursorTracking/Cursor";

const ROOM_ID = "floof-party";

export function Room() {
  const navigate = useNavigate();
  const [playerName, setPlayerName] = useState<string>("");
  const [question, setQuestion] = useState<Question>();
  const [gameState, setGameState] = useState<
    "register" | "matchmaking" | "playing" | "gameover"
  >("register");
  const [countdown, setCountdown] = useState<number>(0);

  const [quizParticipants, setQuizParticipants] = useState<Participant[]>([]);

  const [dimensions, setDimensions] = useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });

  const [mouseData, setMouseData] = useState<Cursors>();

  const socket = usePartySocket({
    host: config.PARTYKIT_URL,
    room: ROOM_ID,
    onMessage({ data }) {
      const event = JSON.parse(data) as
        | QuestionEvent
        | MouseMoveEvent
        | ParticipantsEvent
        | GameOverEvent
        | CountdownEvent;

      if (event.type === "countdown") {
        setCountdown(event.payload);
      }
      if (event.type === "mouse") {
        setMouseData(event.payload);
      }
      if (event.type === "participants") {
        setQuizParticipants(event.payload);
      }
      if (event.type === "question") {
        setCountdown(0);
        setQuestion(event.payload);
        setGameState("playing");
      }
      if (event.type === "gameover") {
        setGameState("gameover");
        setQuizParticipants(event.payload);
      }
    },
  });

  // fetch room data
  useEffect(() => {
    const fetchRoom = async () => {
      await fetch(`${config.PARTYKIT_URL}/party/${ROOM_ID}`)
        .then((response) => {
          if (!response.ok && response.status === 404) {
            // navigate("/");
          } else {
            return response.json();
          }
        })
        .then((data) => {
          if (data.gameOver) {
            setGameState("gameover");
            setQuizParticipants(data.participants);
          }
        });
    };

    fetchRoom();
  }, [navigate, socket]);

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
  // useEffect(() => {
  //   const onMouseMove = (e: MouseEvent) => {
  //     if (!socket) return;
  //     if (!dimensions.width || !dimensions.height) return;
  //     const data: MouseMoveEvent = {
  //       type: "mouse",
  //       payload: {
  //         [myId]: {
  //           x: e.clientX / dimensions.width,
  //           y: e.clientY / dimensions.height,
  //         },
  //       },
  //     };
  //     socket.send(JSON.stringify(data));
  //   };
  //   window.addEventListener("mousemove", onMouseMove);

  //   return () => {
  //     window.removeEventListener("mousemove", onMouseMove);
  //   };
  // }, [socket, dimensions]);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        margin: 0,
        padding: 0,
      }}
    >
      {gameState === "gameover" && (
        <div>
          <h1>Game Over</h1>
        </div>
      )}

      {gameState === "register" && (
        <div>
          <h1>Who are you?</h1>
          <input
            type="text"
            placeholder="Your name"
            value={playerName}
            onChange={(event) => setPlayerName(event.target.value)}
          />
          <button
            disabled={!playerName}
            onClick={() => {
              if (!playerName) return;
              const readyEvent: ParticipantReadyEvent = {
                type: "participant:ready",
                name: playerName,
              };
              socket.send(JSON.stringify(readyEvent));
              setGameState("matchmaking");
            }}
          >
            Ready!
          </button>
        </div>
      )}

      {gameState === "matchmaking" && (
        <div>
          <h1>Waiting for players</h1>
          {quizParticipants.length === 0 && <h2>Nobody else is here yet :(</h2>}

          {quizParticipants.map((participant) => (
            <div key={participant.id}>{participant.name} is ready...</div>
          ))}

          <button
            onClick={() => {
              const startEvent: StartEvent = {
                type: "start",
              };
              socket.send(JSON.stringify(startEvent));
            }}
          >
            Enough waiting... let's go!
          </button>
        </div>
      )}

      {gameState === "playing" && question && (
        <div>
          <div>{question.text}</div>
          {countdown > 0 && <div>Countdown {countdown}</div>}
          <img
            src={`https://assets.blast.tv/images/players/${question.playerId}?height=300&width=auto&format=auto`}
            alt={question.playerId}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            {question.nicknames.map((nickname) => (
              <button
                key={nickname}
                onClick={() => {
                  const answer: AnswerEvent = {
                    type: "answer",
                    payload: {
                      nickname,
                      playerId: question.playerId,
                    },
                  };
                  socket.send(JSON.stringify(answer));
                }}
              >
                {nickname}
              </button>
            ))}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            {quizParticipants.map((participant) => (
              <div key={participant.id}>
                {participant.name}
                <ul>
                  {participant.answers.map((answer) => (
                    <li key={answer.playerId}>
                      {answer.nickname} {answer.correct ? "✅" : "❌"}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

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
