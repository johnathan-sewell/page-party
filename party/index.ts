import type * as Party from "partykit/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};
interface Quiz {
  questions: {
    question: string;

    options: {
      id: string;
      nickname: string;
    }[];

    correctAnswer: {
      id: string;
      nickname: string;
    };
  }[];
}

export default class Server implements Party.Server {
  constructor(readonly room: Party.Room) {}

  quiz: Quiz | undefined;
  roomName: string | undefined;

  async onRequest(req: Party.Request) {
    if (req.method === "OPTIONS") {
      return new Response(null, {
        status: 200,
        headers: corsHeaders,
      });
    }

    // start a new quiz room
    if (req.method === "POST") {
      const teamsJson = await fetch(
        "https://api.blast.tv/v2/tournaments/spring-showdown-2024/teams"
      ).then((res) => res.json());

      const teamIds = teamsJson.teams.map((team: { id: string }) => team.id);

      const playersInAllTeamsJson = await Promise.all(
        teamIds.map((teamId) =>
          fetch(`https://api.blast.tv/v2/teams/${teamId}/players`).then((res) =>
            res.json()
          )
        )
      );

      const allPlayers = playersInAllTeamsJson
        .flat()
        .map((player) => ({ id: player.id, nickname: player.nickname }));

      console.log("fetched players in all teams", allPlayers);

      this.quiz = {
        questions: [],
      };

      for (let i = 0; i < 10; i++) {
        const correctAnswer =
          allPlayers[Math.floor(Math.random() * allPlayers.length)];

        // create 4 player options
        const options: {
          id: string;
          nickname: string;
        }[] = [];
        options.push(correctAnswer);
        while (options.length <= 4) {
          const randomPlayer =
            allPlayers[Math.floor(Math.random() * allPlayers.length)];
          if (!options.includes(randomPlayer)) {
            options.push(randomPlayer);
          }
        }

        this.quiz.questions.push({
          question: "Who is this player?",
          options,
          correctAnswer,
        });
      }

      const payload = await req.json<{ name: string }>();
      this.roomName = payload.name;
    }

    if (this.roomName) {
      return new Response(
        JSON.stringify({ roomName: this.roomName, quiz: this.quiz }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

    return new Response("Not found", { status: 404 });
  }

  async onMessage(message: string, sender: Party.Connection) {
    // if (!this.poll) return;
    // const event = JSON.parse(message);
    // if (event.type === "vote") {
    //   this.poll.votes![event.option] += 1;
    //   this.room.broadcast(JSON.stringify(this.poll));
    // }
    this.room.broadcast(message, [sender.id]);
  }
}

Server satisfies Party.Worker;
