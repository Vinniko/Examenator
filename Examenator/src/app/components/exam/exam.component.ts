import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { setExams } from 'src/app/store/exam/exam.actions';
import {
  select, answer as setAnswer, complite, reset,
} from 'src/app/store/result/result.actions';
import { ExamState } from 'src/app/store/exam/exam.reducer';
import data from 'src/assets/data/data.json';
import { Exam } from 'src/app/models/exam';
import { Result } from 'src/app/models/result';
import { ResultState } from 'src/app/store/result/result.reducer';
import { Answer } from 'src/app/models/answer';
import { AnswerHistory } from 'src/app/models/resultExam';
import { IQuestion, QUESTION_TYPE_MULTIPLE } from 'src/app/interfaces/IQuestion';
import { MultipleQuestion } from 'src/app/models/multipleQuestion';
import { BaseQuestion } from 'src/app/models/baseQuestion';

@Component({
  selector: 'app-exam',
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.css'],
})
export class ExamComponent implements OnInit {
  examState$: Observable<ExamState>;

  resultState$: Observable<ResultState>;

  result: Result | null = null;

  constructor(private store: Store<{ exams: ExamState, result: ResultState }>) {
    this.examState$ = store.select('exams');
    this.resultState$ = store.select('result');
    this.resultState$.subscribe((res: ResultState) => { this.result = res.result; });
  }

  ngOnInit(): void {
    const examsData = data;
    const exams: Exam[] = [];

    examsData.forEach((examData) => {
      const questions: IQuestion[] = [];
      examData.questions.forEach((questionData) => {
        if (questionData.type === QUESTION_TYPE_MULTIPLE) {
          questions.push(
            new MultipleQuestion(
              questionData.id,
              questionData.text,
              questionData.points,
              questionData.answers,
            ),
          );
        } else {
          questions.push(
            new BaseQuestion(
              questionData.id,
              questionData.text,
              questionData.points,
              questionData.answers,
            ),
          );
        }
      });

      exams.push(new Exam(examData.id, examData.name, questions));
    });

    this.store.dispatch(setExams({ exams }));
  }

  selectExam(exam: Exam): void {
    this.store.dispatch(select({ exam }));
  }

  isExamStarted(exam: Exam): boolean {
    if (this.result) {
      return !!this.result.exams.find((resultExam) => resultExam.examId === exam.id);
    }

    return false;
  }

  selectAnswer(exam: Exam, question: IQuestion, answer: Answer): void {
    if (!this.isExamStarted(exam)) {
      this.selectExam(exam);
    }

    const isCorrect = !!question?.answers.find((aw) => (aw.id === answer.id && answer.isCorrect));

    this.store.dispatch(
      setAnswer({
        exam, questionId: question.id, answerId: answer.id, isCorrect,
      }),
    );
  }

  isAnswerSelected(exam: Exam, question: IQuestion, answer: Answer): boolean {
    if (this.result) {
      const tmpExam = this.result.exams.find((resultExam) => resultExam.examId === exam.id);
      return !!tmpExam?.questions.find(
        (tmpQuestion) => (
          tmpQuestion.questionId === question.id
          && tmpQuestion.answerId === answer.id
        ),
      );
    }

    return false;
  }

  compliteExam(exam: Exam): void {
    if (this.result) {
      const tmpExamResult = this.result.exams.find((findExam) => findExam.examId === exam.id);
      let score = 0;
      let correctAnswers = 0;

      exam.questions.forEach((question) => {
        if (question instanceof BaseQuestion) {
          const examAnswerId = tmpExamResult?.questions
            .find((qn) => qn.questionId === question.id)?.answerId;
          score += question.getScore(examAnswerId);
          correctAnswers += question.isCorrectQuestion(examAnswerId) ? 1 : 0;
        }

        if (question instanceof MultipleQuestion) {
          const examAnswers = tmpExamResult?.questions
            .filter((qn) => qn.questionId === question.id)
            .map((qnr) => qnr.answerId)
            .filter((aid) => !!aid);
          score += question.getScore(examAnswers);
          correctAnswers += question.isCorrectQuestion(examAnswers) ? 1 : 0;
        }
      });

      this.store.dispatch(
        complite({ examId: exam.id, score, correctAnswers }),
      );
    }
  }

  isExamCompleted(exam: Exam): boolean {
    if (this.result) {
      return !!this.result.exams.find(
        (resultExam) => (resultExam.examId === exam.id && resultExam.isComplete),
      );
    }

    return false;
  }

  getCompletedExamCorrectQuestions(exam: Exam): number {
    if (this.result) {
      return this.result.exams.find(
        (resultExam) => (resultExam.examId === exam.id && resultExam.isComplete),
      )?.correctAnswers ?? 0;
    }

    return 0;
  }

  getCompletedExamUnCorrectQuestions(exam: Exam): number {
    if (this.result) {
      const tmpExam = this.result.exams.find(
        (resultExam) => (resultExam.examId === exam.id && resultExam.isComplete),
      );

      return (exam.questions.length ?? 0) - (tmpExam?.correctAnswers ?? 0);
    }

    return 0;
  }

  getCompletedExamScore(exam: Exam): number {
    if (this.result) {
      return this.result.exams.find(
        (resultExam) => (resultExam.examId === exam.id && resultExam.isComplete),
      )?.score ?? 0;
    }

    return 0;
  }

  resetExam(exam: Exam): void {
    this.store.dispatch(
      reset({ examId: exam.id }),
    );
  }

  getQuestionAnswerHistory(exam: Exam, question: IQuestion): Answer[] {
    if (this.result) {
      const questionAnswers = question.answers;
      const tmpExam = this.result.exams.find((resultExam) => resultExam.examId === exam.id);
      const answerHistory: AnswerHistory[] = [];

      tmpExam?.answerHistory.forEach((historyElement) => {
        if (historyElement.questionId === question.id) {
          answerHistory.push(historyElement);
        }
      });

      const result: Answer[] = [];

      answerHistory.forEach((element) => {
        const tmpAnswer = questionAnswers.find((answ) => answ.id === element.answerId);

        if (tmpAnswer) {
          result.push(tmpAnswer);
        }
      });

      return result;
    }

    return [];
  }
}
