import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProgramState } from '../reducers/mgaProgram.reducer';

export const selectProgramState = createFeatureSelector<ProgramState>('mgaPrograms');

export const selectMgaPrograms = createSelector(
    selectProgramState,
    (state: ProgramState) => state.programs
);

export const selectMgaProgramsLoading = createSelector(
    selectProgramState,
    (state: ProgramState) => state.loading
);

export const selectMgaProgramsError = createSelector(
    selectProgramState,
    (state: ProgramState) => state.error
);
