import { createReducer, on } from '@ngrx/store';
import { Exam } from 'src/app/models/exam';
import { QUESTION_TYPE_BASE, QUESTION_TYPE_MULTIPLE } from 'src/app/interfaces/IQuestion';
import { Result } from 'src/app/models/result';
import { ResultExam, QuestionResult } from 'src/app/models/resultExam';
import {
  select, answer, complite, reset,
} from './result.actions';

export interface ResultState {
  result: Result;
}

export const initialResultState: ResultState = {
  result: new Result(0, '', []),
};

const selectExam = (state: ResultState, { exam }: { exam: Exam }) => {
  const tmpExams: ResultExam[] = [];
  const tmpQuestions: QuestionResult[] = [];

  state.result.exams.forEach((ex: ResultExam) => {
    tmpExams.push(ex);
  });

  exam.questions.forEach((question) => {
    tmpQuestions.push({
      questionId: question.id,
      answerId: null,
    });
  });

  tmpExams.push(new ResultExam(exam.id, tmpQuestions, false));

  return { ...state, result: new Result(0, '', tmpExams) };
};

const answerOnQuestion = (
  state: ResultState,
  {
    exam, questionId, answerId, isCorrect,
  }: { exam: Exam, questionId: number, answerId: number, isCorrect: boolean },
) => {
  const tmpExams: ResultExam[] = [...state.result.exams];
  const examIndex = tmpExams.findIndex((ex) => ex.examId === exam.id);

  if (examIndex === -1) {
    return { ...state };
  }

  const tmpExam: ResultExam = tmpExams[examIndex];
  const tmpQuestions: QuestionResult[] = [...tmpExam.questions];
  const history = [...tmpExam.answerHistory];
  history.push({
    questionId,
    answerId,
    isCorrect,
  });

  const question = exam.questions.find((qn) => qn.id === questionId);
  let questionIndex = -1;

  if (question?.type === QUESTION_TYPE_BASE) {
    questionIndex = tmpQuestions.findIndex((qn) => qn.questionId === questionId);
  } else if (question?.type === QUESTION_TYPE_MULTIPLE) {
    questionIndex = tmpQuestions.findIndex(
      (qn) => (qn.questionId === questionId && qn.answerId === answerId),
    );
  }

  if (questionIndex === -1) {
    tmpQuestions.push({
      questionId,
      answerId,
    });
    tmpExams[examIndex] = { ...tmpExam, questions: tmpQuestions, answerHistory: history };
  } else {
    if (question?.type === QUESTION_TYPE_MULTIPLE) {
      tmpQuestions.splice(questionIndex, 1);
    } else {
      tmpQuestions[questionIndex] = {
        questionId,
        answerId,
      };
    }

    tmpExams[examIndex] = { ...tmpExam, questions: tmpQuestions, answerHistory: history };
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

const resetExam = (state: ResultState, { examId } : { examId: number }) => {
  const tmpExams: ResultExam[] = [...state.result.exams];
  const examIndex = tmpExams.findIndex((exam) => exam.examId === examId);

  if (examIndex === -1) {
    return { ...state };
  }

  tmpExams.splice(examIndex, 1);

  return { ...state, result: new Result(0, '', tmpExams) };
};

export const resultReducer = createReducer(
  initialResultState,
  on(select, selectExam),
  on(answer, answerOnQuestion),
  on(complite, completeExam),
  on(reset, resetExam),
);
