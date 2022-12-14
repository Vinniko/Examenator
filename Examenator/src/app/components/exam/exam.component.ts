import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  select, answer as setAnswer, complite, reset, textAnswer,
} from 'src/app/store/result/result.actions';
import { ExamState } from 'src/app/store/exam/exam.reducer';
import { Exam } from 'src/app/models/exam';
import { Result } from 'src/app/models/result';
import { ResultState } from 'src/app/store/result/result.reducer';
import { Answer } from 'src/app/models/answer';
import { AnswerHistory } from 'src/app/models/resultExam';
import { IQuestion } from 'src/app/interfaces/IQuestion';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-exam',
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.css'],
})
export class ExamComponent {
  examState$: Observable<ExamState>;

  resultState$: Observable<ResultState>;

  result: Result | null = null;

  exams: Exam[] | [] = [];

  exam: Exam;

  constructor(
    private store: Store<{ exams: ExamState, result: ResultState }>,
    private activateRoute: ActivatedRoute,
    private router: Router,
  ) {
    this.examState$ = store.select('exams');
    this.resultState$ = store.select('result');
    this.resultState$.subscribe((res: ResultState) => { this.result = res.result; });
    this.examState$.subscribe((ex: ExamState) => { this.exams = ex.exams; });
    const examId = Number(activateRoute.snapshot.params['id']);
    const exam = this.exams.find((ex: Exam) => ex.id === examId);
    if (exam) {
      this.exam = exam;

      if (!this.isExamStarted(exam) && !this.isExamCompleted(exam)) {
        this.selectExam(exam);
      }
    } else {
      this.exam = new Exam(0, '', []);
      this.router.navigate(['/']);
    }
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

  setTextAnswer(exam: Exam, question: IQuestion, event: any): void {
    if (!this.isExamStarted(exam)) {
      this.selectExam(exam);
    }

    this.store.dispatch(
      textAnswer({
        exam, questionId: question.id, answerText: event.target.value ?? '',
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

  getTextAnswerValue(exam: Exam, question: IQuestion): string {
    if (this.result) {
      const tmpExam = this.result.exams.find((resultExam) => resultExam.examId === exam.id);
      const tmpQuestion = tmpExam?.questions.find(
        (resultQuestion) => (
          resultQuestion.questionId === question.id
        ),
      );

      return tmpQuestion?.answerText ?? '';
    }

    return '';
  }

  compliteExam(exam: Exam): void {
    if (this.result) {
      const tmpExamResult = this.result.exams.find((findExam) => findExam.examId === exam.id);
      const result = (
        exam.evaluateResults
        && exam.evaluateResults(tmpExamResult?.questions)
      ) ?? { score: 0, correctAnswers: 0 };

      this.store.dispatch(
        complite({ examId: exam.id, ...result }),
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
    this.router.navigate(['/']);
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
