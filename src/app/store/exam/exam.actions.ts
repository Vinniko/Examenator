import { createAction, props } from '@ngrx/store';
import { Exam } from 'src/app/models/exam';

export const setExams = createAction('Set Exams', props<{ exams: Exam[] }>());
