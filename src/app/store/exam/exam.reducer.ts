import { createReducer, on } from '@ngrx/store';
import { Exam } from 'src/app/models/exam';
import { setExams } from './exam.actions';

export interface ExamState {
  exams: Exam[];
}

export const initialExamState: ExamState = {
  exams: [],
};

const setExamsArray = (state: ExamState, { exams }: { exams: Exam[] }) => {
  const tmpExams: Exam[] = [];

  exams?.forEach((exam: Exam) => {
    tmpExams.push(exam);
  });

  return { ...state, exams: tmpExams };
};

export const examReducer = createReducer(
  initialExamState,
  on(setExams, setExamsArray),
);
