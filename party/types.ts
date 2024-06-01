export interface Participant {
  id: string;
  name: string;
  answers: {
    playerId: string;
    nickname: string;
    correct: boolean;
  }[];
}

export type Cursors = { [key: string]: { name: string; x: number; y: number } };

export interface Question {
  text: string;
  playerId: string;
  nicknames: string[];
}

export interface Answer {
  playerId: string;
  nickname: string;
}

export interface ChatMessage {
  name: string;
  text: string;
}

// Events
export type StartEvent = {
  type: "start";
};
export type QuestionEvent = {
  type: "question";
  payload: Question;
};
export type CountdownEvent = {
  type: "countdown";
  payload: number;
};
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
export type AnswerEvent = {
  type: "answer";
  payload: Answer;
};
export type ParticipantReadyEvent = {
  type: "participant:ready";
  name: string;
};
export type ParticipantsEvent = {
  type: "participants";
  payload: Participant[];
};
export type GameOverEvent = {
  type: "gameover";
  payload: Participant[];
};
export type EventType =
  | SendMessageEvent
  | MessagesEvent
  | QuestionEvent
  | MouseMoveEvent
  | ParticipantsEvent
  | GameOverEvent
  | CountdownEvent;
