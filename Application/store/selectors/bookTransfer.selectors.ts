
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { BobState } from 'store/reducers/bookTransfer.reducer';

export const selectBobState = createFeatureSelector<BobState>('bob');

//for BoB List
export const selectBob = createSelector(
    selectBobState,
    (state) => state.dataSource
);

export const selectBobLoading = createSelector(
    selectBobState,
    (state) => state.loading
);

export const selectBobError = createSelector(
    selectBobState,
    (state) => state.error
);

export const selectTotalItems = createSelector(
    selectBobState,
    (state) => state.totalItem
);

export const selectNoRecordsMessage = createSelector(
    selectBobState,
    (state) => state.noRecordsMessage
);

//for parameter data
export const selectParameterData = createSelector(
    selectBobState,
    state => state.parameterdata
);

export const selectParameterLoading = createSelector(
    selectBobState,
    state => state.loading
);

export const selectParameterError = createSelector(
    selectBobState,
    state => state.error
);

//for Agent List
export const selectAgents = createSelector(
    selectBobState,
    state => state.agents
);

export const selectAgentsLoading = createSelector(
    selectBobState,
    state => state.loading
);

export const selectAgentsError = createSelector(
    selectBobState,
    state => state.error
);

//for LOB list
export const selectLobs = createSelector(
    selectBobState,
    state => state.lobs
);

export const selectLobLoading = createSelector(
    selectBobState,
    state => state.loading
);

export const selectLobError = createSelector(
    selectBobState,
    state => state.error
);