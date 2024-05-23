// import { useState } from "react";
import usePartySocket from "partysocket/react";
import { useNavigate, useParams } from "react-router-dom";
import { config } from "./config";
import { useEffect, useState } from "react";
import {
  AnswerEvent,
  Cursors,
  GameOverEvent,
  MouseMoveEvent,
  Participant,
  ParticipantsEvent,
  Question,
  QuestionEvent,
} from "../party/types";
import { Cursor } from "./Cursor";

const myId = Math.random().toString(36).substring(2, 10);

export function Room() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [roomName, setRoomName] = useState<string>();
  const [question, setQuestion] = useState<Question>();
  const [gameState, setGameState] = useState<"playing" | "gameover">("playing");

  const [quizParticipants, setQuizParticipants] = useState<Participant[]>([]);

  const [dimensions, setDimensions] = useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });

  const [mouseData, setMouseData] = useState<Cursors>();

  const socket = usePartySocket({
    host: config.PARTYKIT_URL,
    room: roomId,
    onMessage({ data }) {
      const event = JSON.parse(data) as
        | QuestionEvent
        | MouseMoveEvent
        | ParticipantsEvent
        | GameOverEvent;

      if (event.type === "mouse") {
        setMouseData(event.payload);
      }
      if (event.type === "participants") {
        setQuizParticipants(event.payload);
      }
      if (event.type === "question") {
        setQuestion(event.payload);
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
      await fetch(`${config.PARTYKIT_URL}/party/${roomId}`)
        .then((response) => {
          if (!response.ok && response.status === 404) {
            navigate("/");
          } else {
            return response.json();
          }
        })
        .then((data) => {
          setRoomName(data.roomName);
          setQuestion(data.question);
        });
    };

    fetchRoom();
  }, [roomId, navigate]);

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
      const data: MouseMoveEvent = {
        type: "mouse",
        payload: {
          [myId]: {
            x: e.clientX / dimensions.width,
            y: e.clientY / dimensions.height,
          },
        },
      };
      socket.send(JSON.stringify(data));
    };
    window.addEventListener("mousemove", onMouseMove);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, [socket, dimensions]);

  // register user
  useEffect(() => {
    socket.send(
      JSON.stringify({
        type: "participant:ready",
      })
    );
  }, [socket]);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        margin: 0,
        padding: 0,
      }}
    >
      <div>
        {roomName} ({roomId})
      </div>

      {gameState === "playing" && question && (
        <div>
          <div>{question.text}</div>
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
        </div>
      )}

      {gameState === "gameover" && (
        <div>
          <h1>Game Over</h1>
        </div>
      )}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        Quiz Participants:
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
