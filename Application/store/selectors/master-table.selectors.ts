import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ParameterState } from '../reducers/master-table-reducer';

export const selectParameterState = createFeatureSelector<ParameterState>('parameter');

// Load parameters 
export const selectParameterList = createSelector(
    selectParameterState,
    (state) => state.parameterList
);

export const selectParameterLoading = createSelector(
    selectParameterState,
    (state) => state.loading
);

// Load parameters by key
export const selectFilteredParameterList = createSelector(
    selectParameterState,
    (state) => state.details
);

export const selectIsParameterAddDisabled = createSelector(
    selectParameterState,
    (state) => state.isParameterAddDisabled
);
