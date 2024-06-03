import type * as Party from "partykit/server";
import { EventType } from "./types";

export class MouseHandler {
  constructor(private room: Party.Room) {}

  onMessage(message: string, sender: Party.Connection) {
    const event = JSON.parse(message) as EventType;
    if (event.type === "mouse") {
      this.room.broadcast(
        JSON.stringify({
          type: "mouse",
          payload: event.payload,
        }),
        [sender.id]
      );
    }
  }
}
