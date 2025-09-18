import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProgramState } from 'store/reducers/program.reducer';

export const selectProgramState = createFeatureSelector<ProgramState>('program'); // Key in StoreModule

// All Programs
export const selectAllProgram = createSelector(
    selectProgramState,
    (state: ProgramState) => state.program
);


export const selectFilteredPrograms = createSelector(
    selectProgramState,
    (state: ProgramState, props: { userId: number; clientId: number }) =>{
        console.log('state 16 ',state)
      return  state.program
    }
);

// No record message
export const selectProgramNoRecordMessage = createSelector(
    selectFilteredPrograms,
    (state) => state.length > 0 ? '' : 'No Record Found.'
);
