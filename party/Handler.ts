import type * as Party from "partykit/server";

export interface Handler {
  onMessage(message: string, sender: Party.Connection): void;
}
