export interface Participant {
  id: string;
  name: string;
  answers: {
    playerId: string;
    nickname: string;
    correct: boolean;
  }[];
}

export type Cursors = { [key: string]: { x: number; y: number } };

export interface Question {
  text: string;
  playerId: string;
  nicknames: string[];
}

export interface CorrectAnswer {
  playerId: string;
  nickname: string;
}

export type QuestionEvent = {
  type: "question";
  payload: Question;
};
export type MouseMoveEvent = {
  type: "mouse";
  payload: Cursors;
};
export type AnswerEvent = {
  type: "answer";
  payload: CorrectAnswer;
};
export type ParticipantReadyEvent = {
  type: "participant:ready";
  payload: CorrectAnswer;
};
export type ParticipantsEvent = {
  type: "participants";
  payload: Participant[];
};
export type GameOverEvent = {
  type: "gameover";
  payload: Participant[];
};
