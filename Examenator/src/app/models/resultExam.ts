export interface QuestionResult {
  questionId: number,
  answerId: number | null,
  answerText: string | undefined,
}

export interface AnswerHistory {
  questionId: number,
  answerId: number,
  isCorrect: boolean,
}

export class ResultExam {
  examId: number;

  questions: QuestionResult[];

  answerHistory: AnswerHistory[] = [];

  isComplete: boolean;

  score: number = -1;

  correctAnswers: number = 0;

  // eslint-disable-next-line max-len
  constructor(examId: number, questions: QuestionResult[], isComplete: boolean, history: AnswerHistory[] = []) {
    this.examId = examId;
    this.questions = questions;
    this.isComplete = isComplete;
    this.answerHistory = history;
  }
}
