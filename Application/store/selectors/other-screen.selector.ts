import { createFeatureSelector, createSelector } from "@ngrx/store";
import { FormsState } from "store/reducers/other.screen-reducer";

export const selectFormsState = createFeatureSelector<FormsState>('forms');

export const selectAllForms = createSelector(
    selectFormsState,
    (state) => state.forms
);

export const selectFormsLoading = createSelector(
    selectFormsState,
    (state) => state.loading
);

export const selectFormsError = createSelector(
    selectFormsState,
    (state) => state.error
);

export const selectFormsLoaded = createSelector(
    selectFormsState,
    state => state.loaded
);


// Selectors for form types (parameters)
export const selectFormTypes = createSelector(
    selectFormsState,
    state => state.formTypes
);

export const selectFormTypesLoaded = createSelector(
    selectFormsState,
    state => state.loaded
);