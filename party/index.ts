import type * as Party from "partykit/server";
import { MouseHandler } from "./MouseHandler";

export default class Server implements Party.Server {
  mouseHandler: MouseHandler;

  constructor(readonly room: Party.Room) {
    this.mouseHandler = new MouseHandler(room);
  }

  async onMessage(message: string, sender: Party.Connection) {
    this.mouseHandler.onMessage(message, sender);
  }
}

Server satisfies Party.Worker;
