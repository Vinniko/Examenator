export interface QuestionResult {
  questionId: number,
  answerId: number | null,
}

export class ResultExam {
  examId: number;

  questions: QuestionResult[];

  isComplete: boolean;

  score: number = -1;

  correctAnswers: number = 0;

  constructor(examId: number, questions: QuestionResult[], isComplete: boolean) {
    this.examId = examId;
    this.questions = questions;
    this.isComplete = isComplete;
  }
}
