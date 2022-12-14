import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { IQuestion, QUESTION_TYPE_MULTIPLE, QUESTION_TYPE_TEXT } from 'src/app/interfaces/IQuestion';
import { BaseQuestion } from 'src/app/models/baseQuestion';
import { Exam } from 'src/app/models/exam';
import { MultipleQuestion } from 'src/app/models/multipleQuestion';
import { Result } from 'src/app/models/result';
import { TextQuestion } from 'src/app/models/textQuestion';
import { setExams } from 'src/app/store/exam/exam.actions';
import { ExamState } from 'src/app/store/exam/exam.reducer';
import { select } from 'src/app/store/result/result.actions';
import { ResultState } from 'src/app/store/result/result.reducer';
import data from 'src/assets/data/data.json';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit {
  examState$: Observable<ExamState>;

  result: Result | null = null;

  constructor(private store: Store<{ exams: ExamState, result: ResultState }>) {
    this.examState$ = store.select('exams');
    store.select('result').subscribe((res: ResultState) => { this.result = res.result; });
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
        } else if (questionData.type === QUESTION_TYPE_TEXT) {
          questions.push(
            new TextQuestion(
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

  isExamCompleted(exam: Exam): boolean {
    if (this.result) {
      return !!this.result.exams.find(
        (resultExam) => (resultExam.examId === exam.id && resultExam.isComplete),
      );
    }

    return false;
  }
}
