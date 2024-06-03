export type Cursors = { [key: string]: { name: string; x: number; y: number } };

export interface ChatMessage {
  name: string;
  text: string;
}

// Events
export type MouseMoveEvent = {
  type: "mouse";
  payload: Cursors;
};
export type SendMessageEvent = {
  type: "sendMessage";
  payload: ChatMessage;
};
export type MessagesEvent = {
  type: "messages";
  payload: ChatMessage[];
};

export type EventType = SendMessageEvent | MessagesEvent | MouseMoveEvent;
