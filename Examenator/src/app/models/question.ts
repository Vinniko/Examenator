import { Answer } from './answer';

export class Question {
  id: number;

  text: string;

  points: number;

  answers: Answer[];

  constructor(id: number, text: string, points: number, ansewers: Answer[]) {
    this.id = id;
    this.text = text;
    this.points = points;
    this.answers = ansewers;
  }
}
