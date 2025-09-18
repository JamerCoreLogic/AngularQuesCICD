import { createReducer, on } from '@ngrx/store';
import * as ProgramActions from '../actions/mgaProgram.action';

export interface ProgramState {
    programs: any[];
    loading: boolean;
    error: any;
}

export const initialState: ProgramState = {
    programs: [],
    loading: false,
    error: null,
};

export const mgaProgramReducer = createReducer(
    initialState,
    on(ProgramActions.loadMGAPrograms, state => ({
        ...state,
        loading: true,
        error: null,
    })),
    on(ProgramActions.loadMGAProgramsSuccess, (state, { programs }) => ({
        ...state,
        programs,
        loading: false,
    })),
    on(ProgramActions.loadMGAProgramsFailure, (state, { error }) => ({
        ...state,
        error,
        loading: false,
    }))
);
