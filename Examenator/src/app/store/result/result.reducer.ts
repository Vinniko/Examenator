import { createReducer, on } from '@ngrx/store';
import { Exam } from 'src/app/models/exam';
import { Result } from 'src/app/models/result';
import { ResultExam, QuestionResult } from 'src/app/models/resultExam';
import { select, answer, complite } from './result.actions';

export interface ResultState {
  result: Result;
}

export const initialResultState: ResultState = {
  result: new Result(0, '', []),
};

const selectExam = (state: ResultState, { exam }: { exam: Exam }) => {
  const tmpExams: ResultExam[] = [];
  tmpExams.push(new ResultExam(exam.id, [], false));

  return { ...state, result: new Result(0, '', tmpExams) };
};

const answerOnQuestion = (
  state: ResultState,
  { examId, questionId, answerId }: { examId: number, questionId: number, answerId: number },
) => {
  const tmpExams: ResultExam[] = [...state.result.exams];
  const examIndex = tmpExams.findIndex((exam) => exam.examId === examId);

  if (examIndex === -1) {
    return { ...state };
  }

  const tmpExam: ResultExam = tmpExams[examIndex];
  const tmpQuestions: QuestionResult[] = [...tmpExam.questions];
  const questionIndex = tmpQuestions.findIndex((question) => question.questionId === questionId);

  if (questionIndex === -1) {
    tmpQuestions.push({
      questionId,
      answerId,
    });
    tmpExams[examIndex] = { ...tmpExam, questions: tmpQuestions };
  } else {
    tmpQuestions[questionIndex] = {
      questionId,
      answerId,
    };
    tmpExams[examIndex] = { ...tmpExam, questions: tmpQuestions };
  }

  return { ...state, result: new Result(0, '', tmpExams) };
};

const completeExam = (
  state: ResultState,
  { examId, score, correctAnswers } : { examId: number, score: number, correctAnswers: number },
) => {
  const tmpExams: ResultExam[] = [...state.result.exams];
  const examIndex = tmpExams.findIndex((exam) => exam.examId === examId);

  if (examIndex === -1) {
    return { ...state };
  }

  let tmpExam: ResultExam = tmpExams[examIndex];
  tmpExam = {
    ...tmpExam, isComplete: true, score, correctAnswers,
  };
  tmpExams[examIndex] = tmpExam;

  return { ...state, result: new Result(0, '', tmpExams) };
};

export const resultReducer = createReducer(
  initialResultState,
  on(select, selectExam),
  on(answer, answerOnQuestion),
  on(complite, completeExam),
);
