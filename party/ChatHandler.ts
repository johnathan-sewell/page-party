import type * as Party from "partykit/server";
import { ChatMessage, EventType } from "./types";

export class ChatHandler {
  #messages: ChatMessage[] = [];

  constructor(private room: Party.Room) {}

  broadcastMessages() {
    this.room.broadcast(
      JSON.stringify({
        type: "messages",
        payload: this.#messages,
      })
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onMessage(message: string, sender: Party.Connection) {
    const event = JSON.parse(message) as EventType;
    if (event.type === "sendMessage") {
      this.#messages.push(event.payload);
      this.broadcastMessages();
    }
  }
  onConnect(sender: Party.Connection) {
    this.#messages.push({
      name: "PARTYBOT",
      text: `🎉 ${sender.id} has joined the party! 🎉`,
    });
    this.broadcastMessages();
  }
  onClose(sender: Party.Connection) {
    this.#messages.push({
      name: "PARTYBOT",
      text: `${sender.id} had somewhere else to be. 😢`,
    });
    this.broadcastMessages();
  }
}
