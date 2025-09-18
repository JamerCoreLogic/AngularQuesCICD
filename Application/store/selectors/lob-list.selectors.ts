import { createFeatureSelector, createSelector } from '@ngrx/store';
import { LobState } from '../reducers/lob-list.reducer';

export const selectLobState = createFeatureSelector<LobState>('lobList');

export const selectedLobList = createSelector(
    selectLobState,
    (state: LobState) => state.lobList
);

export const selectLobLoading = createSelector(
    selectLobState,
    (state: LobState) => state.loading
);

export const selectLobError = createSelector(
    selectLobState,
    (state: LobState) => state.error
);
