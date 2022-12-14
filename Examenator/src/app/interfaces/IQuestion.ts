import { Answer } from '../models/answer';

export const QUESTION_TYPE_BASE = 'base';
export const QUESTION_TYPE_MULTIPLE = 'multiple';
export const QUESTION_TYPE_TEXT = 'text';

export interface IQuestion {
  id: number;

  text: string;

  points: number;

  answers: Answer[];

  type: string;

  getScore?: Function;

  isCorrectQuestion?: Function;
  isCorrectAnswer?: Function;
}
