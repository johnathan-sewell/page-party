import type * as Party from "partykit/server";
import { MouseHandler } from "./MouseHandler";
import { ChatHandler } from "./ChatHandler";

export default class Server implements Party.Server {
  #mouseHandler: MouseHandler;
  #chatHandler: ChatHandler;

  constructor(readonly room: Party.Room) {
    this.#mouseHandler = new MouseHandler(room);
    this.#chatHandler = new ChatHandler(room);
  }

  async onMessage(message: string, sender: Party.Connection) {
    this.#mouseHandler.onMessage(message, sender);
    this.#chatHandler.onMessage(message, sender);
  }

  async onConnect(sender: Party.Connection) {
    this.#chatHandler.onConnect(sender);
  }

  async onClose(sender: Party.Connection) {
    this.#chatHandler.onClose(sender);
  }
}

Server satisfies Party.Worker;
