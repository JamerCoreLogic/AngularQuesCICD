import { createFeatureSelector, createSelector } from '@ngrx/store';
import { InsuredProspectsState } from '../reducers/insured.reducer';

export const selectInsuredProspectsState =
    createFeatureSelector<InsuredProspectsState>('insuredProspects');

export const selectInsuredProspects = createSelector(
    selectInsuredProspectsState,
    (state) => state.data
);

export const selectLoading = createSelector(
    selectInsuredProspectsState,
    (state) => state.loading
);

export const selectError = createSelector(
    selectInsuredProspectsState,
    (state) => state.error
);