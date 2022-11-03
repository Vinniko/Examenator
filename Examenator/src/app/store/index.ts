import { ActionReducerMap, MetaReducer } from "@ngrx/store";
import { counterReducer } from "./counter/counter.reducer";
import { hydrationMetaReducer } from "./hydration/hydration.reducer";

export interface RootState {
  count: number,
  bleh: number,
}

export const reducers: ActionReducerMap<RootState> = {
  count: counterReducer,
  bleh: counterReducer,
}

export const metaReducers: MetaReducer[] = [
  hydrationMetaReducer
]
