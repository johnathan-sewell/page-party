import type * as Party from "partykit/server";
import {
  AnswerEvent,
  CorrectAnswer,
  MouseMoveEvent,
  Participant,
  ParticipantReadyEvent,
  Question,
  QuestionEvent,
} from "./types";
import { players } from "./players";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const QUIZ_LENGTH = 5;
export default class Server implements Party.Server {
  constructor(readonly room: Party.Room) {}

  questions: Question[];
  correctAnswers: CorrectAnswer[];
  currentQuestion: Question | undefined;

  roomName: string | undefined;
  participants: Participant[] = [];

  async createRoom(name: string) {
    this.questions = [];
    this.correctAnswers = [];

    // create questions
    for (let i = 0; i < QUIZ_LENGTH; i++) {
      const { id: playerId, nickname: nickname } =
        players[Math.floor(Math.random() * players.length)];

      // create 4 player options
      const options: string[] = [];

      // TODO shuffle the options so the first one isn't always the correct answer
      options.push(nickname);

      while (options.length <= 3) {
        const randomPlayer =
          players[Math.floor(Math.random() * players.length)];
        if (!options.includes(randomPlayer.nickname)) {
          options.push(randomPlayer.nickname);
        }
      }

      this.questions.push({
        playerId,
        text: `Question ${i + 1}: Who is this?`,
        nicknames: options,
      });
      this.correctAnswers.push({
        playerId,
        nickname,
      });
    }

    this.currentQuestion = this.questions[0];
    this.roomName = name;
  }

  async onRequest(req: Party.Request) {
    if (req.method === "OPTIONS") {
      return new Response(null, {
        status: 200,
        headers: corsHeaders,
      });
    }

    // POST starts a new quiz room
    if (req.method === "POST") {
      const payload = await req.json<{ name: string }>();
      await this.createRoom(payload.name);
    }

    // else GET returns the current question
    if (this.roomName && this.questions) {
      return new Response(
        JSON.stringify({
          roomName: this.roomName,
          question: this.questions[0],
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

    return new Response("Not found", { status: 404, headers: corsHeaders });
  }

  async onMessage(messageString: string, sender: Party.Connection) {
    const event = JSON.parse(messageString) as
      | AnswerEvent
      | MouseMoveEvent
      | ParticipantReadyEvent;

    if (event.type === "mouse") {
      this.room.broadcast(
        JSON.stringify({
          type: "mouse",
          payload: event.payload,
        }),
        [sender.id]
      );
    }

    if (event.type === "participant:ready") {
      this.participants.push({
        id: sender.id,
        name: sender.id,
        answers: [],
      });

      for (const everyone of this.room.getConnections()) {
        everyone.send(
          JSON.stringify({
            type: "participants",
            payload: this.participants,
          })
        );
      }
    }

    if (event.type === "answer") {
      const { nickname, playerId } = event.payload;

      const participant = this.participants.find(
        (participant) => participant.id === sender.id
      );

      if (!participant) return;
      if (!this.currentQuestion) return;
      // already answered this question
      if (participant.answers.find((answer) => answer.playerId === playerId))
        return;

      // update answers
      participant.answers.push({
        playerId,
        nickname,
        correct:
          nickname ===
          this.correctAnswers.find((a) => a.playerId === playerId)?.nickname,
      });

      // if all participants have answered this question
      if (
        this.participants.every((participant) =>
          participant.answers.find(
            (answer) => answer.playerId === this.currentQuestion!.playerId
          )
        )
      ) {
        // if this is the last question
        const indexOfCurrentQuestion = this.questions!.findIndex(
          (question) => question === this.currentQuestion
        );
        if (indexOfCurrentQuestion === this.questions!.length - 1) {
          // end the game
          for (const everyone of this.room.getConnections()) {
            everyone.send(
              JSON.stringify({
                type: "gameover",
                payload: this.participants,
              })
            );
          }
          return;
        } else {
          // send new answer states to everyone
          for (const everyone of this.room.getConnections()) {
            everyone.send(
              JSON.stringify({
                type: "participants",
                payload: this.participants,
              })
            );
          }
        }

        // move to the next question
        this.currentQuestion = this.questions![indexOfCurrentQuestion + 1];

        // send everyone the new question after 5 seconds
        setTimeout(() => {
          if (!this.currentQuestion) return; // this should never happen?
          for (const everyone of this.room.getConnections()) {
            const questionEvent: QuestionEvent = {
              type: "question",
              payload: this.currentQuestion,
            };
            everyone.send(JSON.stringify(questionEvent));
          }
        }, 5000);
      }
    }
  }

  async onClose(sender: Party.Connection) {
    // remove the sender from the participants list
    this.participants = this.participants.filter(({ id }) => id !== sender.id);
    for (const everyone of this.room.getConnections()) {
      everyone.send(
        JSON.stringify({
          type: "participants",
          payload: this.participants,
        })
      );
    }
  }
}

Server satisfies Party.Worker;
