import { createFeatureSelector, createSelector } from "@ngrx/store";
import { WorkboardState } from "store/reducers/workboard.reducer";

export const selectWorkboardState = createFeatureSelector<WorkboardState>('workboard');

// Workboard Selectors
export const selectWorkboardData = createSelector(
    selectWorkboardState,
    (state) => state.data
);

export const selectWorkboardLoaded = createSelector(
    selectWorkboardState,
    (state) => state.loaded
);

export const selectWorkboardLoading = createSelector(
    selectWorkboardState,
    (state) => state.loading
);

// MGA Program Selectors
export const selectPrograms = createSelector(
    selectWorkboardState,
    (state) => state.programs
);

export const selectProgramsLoading = createSelector(
    selectWorkboardState,
    (state) => state.loading
);

export const selectProgramsError = createSelector(
    selectWorkboardState,
    (state) => state.error
);

// Quotes Selectors
export const selectQuotes = createSelector(
    selectWorkboardState,
    (state) => state.quotes
);

export const selectQuotesTotal = createSelector(
    selectWorkboardState,
    (state) => state.totalItem
);

export const selectQuotesLoading = createSelector(
    selectWorkboardState,
    (state) => state.loading
);

export const selectQuotesError = createSelector(
    selectWorkboardState,
    (state) => state.error
);

export const selectNoRecordsMessage = createSelector(
    selectWorkboardState,
    (state) => state.noRecordsMessage
);