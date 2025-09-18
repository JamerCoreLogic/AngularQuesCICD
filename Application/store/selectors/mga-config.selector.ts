import { createFeatureSelector, createSelector } from "@ngrx/store";
import { MGAState } from "store/reducers/mga-config.reducer";

//export const selectMGAState = (state: AppState) => state.mga;
export const selectMGAState = createFeatureSelector<MGAState>('mgaConfig');

export const selectMGALoading = createSelector(
    selectMGAState,
    (state) => state.loading
);

export const selectMGAConfiguration = createSelector(
    selectMGAState,
    (state) => state.configuration
);

export const selectMGALobs = createSelector(
    selectMGAState,
    (state) => state.lobs
);

export const selectMGACarriers = createSelector(
    selectMGAState,
    (state) => state.carriers
);

export const selectMGAStates = createSelector(
    selectMGAState,
    (state) => state.states
);