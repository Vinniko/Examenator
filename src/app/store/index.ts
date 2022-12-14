import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { counterReducer } from './counter/counter.reducer';
import { examReducer } from './exam/exam.reducer';
import { hydrationMetaReducer } from './hydration/hydration.reducer';
import { resultReducer } from './result/result.reducer';
import { RootState } from './states';

export const reducers: ActionReducerMap<RootState> = {
  count: counterReducer,
  exams: examReducer,
  result: resultReducer,
};

export const metaReducers: MetaReducer[] = [
  hydrationMetaReducer,
];
