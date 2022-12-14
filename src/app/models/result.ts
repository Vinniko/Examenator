import { ResultExam } from './resultExam';

export class Result {
  id: number;

  name: string;

  exams: ResultExam[];

  constructor(id: number, name: string, exams: ResultExam[]) {
    this.id = id;
    this.name = name;
    this.exams = exams;
  }
}
