import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { counterReducer } from './counter/counter.reducer';
import { hydrationMetaReducer } from './hydration/hydration.reducer';
import { RootState } from './states';

export const reducers: ActionReducerMap<RootState> = {
  count: counterReducer,
};

export const metaReducers: MetaReducer[] = [
  hydrationMetaReducer,
];
