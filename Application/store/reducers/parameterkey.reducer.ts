// state.reducer.ts
import { createReducer, on } from '@ngrx/store';
import { loadStates, loadStatesSuccess, loadStatesFailure } from '../actions/parameterkey.action';

export interface StateFeature {
    stateList: any;
    loading: boolean;
    error: any;
}

export const initialState: StateFeature = {
    stateList: null,
    loading: false,
    error: null,
};

export const stateReducer = createReducer(
    initialState,
    on(loadStates, state => ({ ...state, loading: true, error: null })),
    on(loadStatesSuccess, (state, { stateList }) => ({
        ...state,
        stateList,
        loading: false,
    })),
    on(loadStatesFailure, (state, { error }) => ({ ...state, error, loading: false }))
);
