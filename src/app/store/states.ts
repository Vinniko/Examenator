import { ExamState } from './exam/exam.reducer';
import { ResultState } from './result/result.reducer';

export interface RootState {
  count: number;
  exams: ExamState;
  result: ResultState;
}
