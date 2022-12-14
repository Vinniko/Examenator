import { IQuestion, QUESTION_TYPE_TEXT } from '../interfaces/IQuestion';
import { Answer } from './answer';

export class TextQuestion implements IQuestion {
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
    this.type = QUESTION_TYPE_TEXT;
  }

  isCorrectAnswer: Function = (answerText: string) => (
    this.answers.find(
      (answer: Answer) => answer.text.toLowerCase() === answerText.toLowerCase(),
    )?.isCorrect ?? false
  );

  getScore: Function = (answerText: string) => {
    if (this.isCorrectAnswer) {
      return this.isCorrectAnswer(answerText) ? this.points : 0;
    }

    return 0;
  };

  isCorrectQuestion: Function = (answerText: string) => {
    if (this.isCorrectAnswer) {
      return this.isCorrectAnswer(answerText);
    }

    return false;
  };
}
