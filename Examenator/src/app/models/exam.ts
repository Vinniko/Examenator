import { Question } from './question';

export class Exam {
  id: number;

  name: string;

  questions: Question[];

  constructor(id: number, name: string, questions: Question[]) {
    this.id = id;
    this.name = name;
    this.questions = questions;
  }
}
