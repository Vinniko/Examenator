import { IQuestion, QUESTION_TYPE_MULTIPLE } from '../interfaces/IQuestion';
import { Answer } from './answer';

export class MultipleQuestion implements IQuestion {
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
    this.type = QUESTION_TYPE_MULTIPLE;
  }

  isCorrectAnswer: Function = (answerId: number) => (
    this.answers.find((answer: Answer) => answer.id === answerId)?.isCorrect ?? false
  );

  getScore: Function = (answerIds: number[]) => {
    const score = answerIds
      .map((answerId: number) => !!(this.isCorrectAnswer && this.isCorrectAnswer(answerId)))
      .reduce((res, cur) => (cur ? res + this.points : res - this.points), 0);

    return score > 0 ? score : 0;
  };

  isCorrectQuestion: Function = (answerIds: number[]) => {
    const correctAnswers = this.answers.filter((answer: Answer) => answer.isCorrect)
      .map((answer: Answer) => answer.id);
    correctAnswers.sort();
    answerIds.sort();

    return correctAnswers.length === answerIds.length
        && correctAnswers.every((this_i, i) => this_i === answerIds[i]);
  };
}
