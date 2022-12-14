import { IQuestion } from '../interfaces/IQuestion';
import { BaseQuestion } from './baseQuestion';
import { MultipleQuestion } from './multipleQuestion';
import { QuestionResult } from './resultExam';
import { TextQuestion } from './textQuestion';

export class Exam {
  id: number;

  name: string;

  questions: IQuestion[];

  constructor(id: number, name: string, questions: IQuestion[]) {
    this.id = id;
    this.name = name;
    this.questions = questions;
  }

  evaluateResults?: Function = (resultQuestionAnswers: QuestionResult[]) => {
    let score = 0;
    let correctAnswers = 0;

    this.questions.forEach((question) => {
      if (question instanceof BaseQuestion) {
        const examAnswerId = resultQuestionAnswers
          .find((qn) => qn.questionId === question.id)?.answerId;
        score += question.getScore(examAnswerId);
        correctAnswers += question.isCorrectQuestion(examAnswerId) ? 1 : 0;
      }

      if (question instanceof MultipleQuestion) {
        const examAnswers = resultQuestionAnswers
          .filter((qn) => qn.questionId === question.id)
          .map((qnr) => qnr.answerId)
          .filter((aid) => !!aid);
        score += question.getScore(examAnswers);
        correctAnswers += question.isCorrectQuestion(examAnswers) ? 1 : 0;
      }

      if (question instanceof TextQuestion) {
        const examAnswer = resultQuestionAnswers
          .find((qn) => qn.questionId === question.id);
          // .map((qnr) => qnr.answerId)
          // .filter((aid) => !!aid);
        score += question.getScore(examAnswer?.answerText ?? '');
        correctAnswers += question.isCorrectQuestion(examAnswer?.answerText ?? '') ? 1 : 0;
      }
    });

    return { score, correctAnswers };
  };
}
