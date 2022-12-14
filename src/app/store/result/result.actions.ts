import { createAction, props } from '@ngrx/store';
import { Exam } from 'src/app/models/exam';

export const select = createAction('[Result] Set Exam result', props<{ exam: Exam }>());
export const answer = createAction('[Result] Select answer in question', props<{ exam: Exam, questionId: number, answerId: number, isCorrect: boolean }>());
export const textAnswer = createAction('[Result] Write answer on question', props<{ exam: Exam, questionId: number, answerText: string }>());
export const complite = createAction('[Result] Complete exam', props<{ examId: number, score: number, correctAnswers: number }>());
export const reset = createAction('[Result] Reset Exam result', props<{ examId: number }>());
