import { createFeatureSelector, createSelector } from "@ngrx/store";
import { MGAProgramState } from "store/reducers/submission.reducer";


export const selectMGAProgramState = createFeatureSelector<MGAProgramState>('submission');

export const selectAllPrograms = createSelector(
    selectMGAProgramState,
    state => state.programs
);

export const selectProgramsLoading = createSelector(
    selectMGAProgramState,
    state => state.loading
);

// selector to get all states for a given lob
export const selectStatesByLob = (lob: string) => createSelector(
    selectAllPrograms, // already returns mgaProgramList[]
    (programs) => {
        const matchingProgram = programs.find(p => p.mgaLobs?.lob === lob);
        if (!matchingProgram) return [];

        const states = [...(matchingProgram.mgaStates || [])];

        // Add "Other State"
        states.push({
            state: "Other State",
            stateCode: null,
            stateId: null
        });

        return states;
    }
);