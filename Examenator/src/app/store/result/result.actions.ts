import { createAction, props } from '@ngrx/store';
import { Exam } from 'src/app/models/exam';

export const select = createAction('Set Exam result', props<{ exam: Exam }>());
export const answer = createAction('Select answer in question', props<{ examId: number, questionId: number, answerId: number }>());
export const complite = createAction('Complete exam', props<{ examId: number, score: number, correctAnswers: number }>());
