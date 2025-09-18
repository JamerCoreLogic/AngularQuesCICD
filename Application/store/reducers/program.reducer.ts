import { createReducer, on } from "@ngrx/store";
import * as ProgramActions from '../actions/program.action';
import { Program } from "src/app/modules/programs/program.model";


export interface ProgramState {
    program: Program[];
    error: any;
}
export const initialState: ProgramState = {
    program: [],
    error: null,
};

export const programReducer = createReducer(
    initialState,
    on(ProgramActions.loadProgramList, (state) => ({
        ...state,
        loading: true
    })),
    on(ProgramActions.loadProgramListSuccess, (state, { programList }) => ({
        ...state,
        program: programList,
        loading: false
    })),
    on(ProgramActions.loadProgramListFailure, (state, { error }) => ({
        ...state,
        error,
        loading: false
    }))
);