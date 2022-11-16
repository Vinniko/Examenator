import { IQuestion } from '../interfaces/IQuestion';

export class Exam {
  id: number;

  name: string;

  questions: IQuestion[];

  constructor(id: number, name: string, questions: IQuestion[]) {
    this.id = id;
    this.name = name;
    this.questions = questions;
  }
}
