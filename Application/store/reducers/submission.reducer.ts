import { createReducer, on } from "@ngrx/store";
import * as MGAProgramActions from '../actions/submission.action';


export interface MGAProgramState {
    programs: any[];
    error: any;
    loading: boolean;
}

const initialState: MGAProgramState = {
    programs: [],
    error: null,
    loading: false
};

export const submissionsReducer = createReducer(
    initialState,
    on(MGAProgramActions.loadMGAPrograms, state => ({ ...state, loading: true })),
    on(MGAProgramActions.loadMGAProgramsSuccess, (state, { programs }) => ({
        ...state,
        programs,
        loading: false,
        error: null
    })),
    on(MGAProgramActions.loadMGAProgramsFailure, (state, { error }) => ({
        ...state,
        error,
        loading: false
    }))
);