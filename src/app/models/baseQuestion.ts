import { IQuestion, QUESTION_TYPE_BASE } from '../interfaces/IQuestion';
import { Answer } from './answer';

export class BaseQuestion implements IQuestion {
  id: number;

  text: string;

  points: number;

  answers: Answer[];

  type: string;

  constructor(id: number, text: string, points: number, ansewers: Answer[]) {
    this.id = id;
    this.text = text;
    this.points = points;
    this.answers = ansewers;
    this.type = QUESTION_TYPE_BASE;
  }

  isCorrectAnswer: Function = (answerId: number) => (
    this.answers.find((answer: Answer) => answer.id === answerId)?.isCorrect ?? false
  );

  getScore: Function = (answerId: number) => {
    if (this.isCorrectAnswer) {
      return this.isCorrectAnswer(answerId) ? this.points : 0;
    }

    return 0;
  };

  isCorrectQuestion: Function = (answerId: number) => {
    if (this.isCorrectAnswer) {
      return this.isCorrectAnswer(answerId);
    }

    return false;
  };
}
