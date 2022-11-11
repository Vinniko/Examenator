import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { setExams } from 'src/app/store/exam/exam.actions';
import { select, answer as setAnswer, complite } from 'src/app/store/result/result.actions';
import { ExamState } from 'src/app/store/exam/exam.reducer';
import data from 'src/assets/data/data.json';
import { Exam } from 'src/app/models/exam';
import { Result } from 'src/app/models/result';
import { ResultState } from 'src/app/store/result/result.reducer';
import { Question } from 'src/app/models/question';
import { Answer } from 'src/app/models/answer';

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
    this.store.dispatch(setExams({ exams: data }));
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

  selectAnswer(exam: Exam, question: Question, answer: Answer): void {
    if (!this.isExamStarted(exam)) {
      this.selectExam(exam);
    }

    this.store.dispatch(
      setAnswer({ examId: exam.id, questionId: question.id, answerId: answer.id }),
    );
  }

  isAnswerSelected(exam: Exam, question: Question, answer: Answer): boolean {
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

      tmpExamResult?.questions.forEach((tmpQuestion) => {
        const question = exam.questions.find((qn) => qn.id === tmpQuestion.questionId);
        const answer = question?.answers.find((aw) => aw.id === tmpQuestion.answerId);

        if (answer?.isCorrect) {
          score += question?.points ?? 0;
          correctAnswers += 1;
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

      return (tmpExam?.questions.length ?? 0) - (tmpExam?.correctAnswers ?? 0);
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

  // resetExam(exam: Exam): void {

  // }
}
