// state.selectors.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { StateFeature } from '../reducers/parameterkey.reducer';

export const selectStateFeature = createFeatureSelector<StateFeature>('stateList');

export const selectStates = createSelector(
    selectStateFeature,
    state => state.stateList
);

export const selectStatesLoading = createSelector(
    selectStateFeature,
    state => state.loading
);
