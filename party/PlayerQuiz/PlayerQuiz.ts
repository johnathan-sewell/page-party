import { Answer, Question } from "../types";
import { players } from "./players";

const QUIZ_LENGTH = 2;

function createQuestions() {
  const questions: Question[] = [];
  const answers: Answer[] = [];

  // create questions
  for (let i = 0; i < QUIZ_LENGTH; i++) {
    const { id: playerId, nickname: nickname } =
      players[Math.floor(Math.random() * players.length)];

    // create 4 player options
    const options: string[] = [];

    // TODO shuffle the options so the first one isn't always the correct answer
    options.push(nickname);

    while (options.length <= 3) {
      const randomPlayer = players[Math.floor(Math.random() * players.length)];
      if (!options.includes(randomPlayer.nickname)) {
        options.push(randomPlayer.nickname);
      }
    }

    questions.push({
      playerId,
      text: `Question ${i + 1} of ${QUIZ_LENGTH}: Who's am I?`,
      nicknames: options,
    });
    answers.push({
      playerId,
      nickname,
    });
  }
  return { questions, answers };
}

export class PlayerQuiz {
  answers: Answer[];
  questions: Question[];
  currentQuestion: Question | undefined;

  // countDown: number | undefined = 0;
  // gameOver: boolean = false;
  // interval: number | undefined = undefined;
  // matchMaking = false;
  // participants: Participant[] = [];

  constructor() {
    const { questions, answers } = createQuestions();
    this.questions = questions;
    this.answers = answers;
    this.currentQuestion = this.questions[0];
  }
}
