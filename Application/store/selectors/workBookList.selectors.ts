import { createFeatureSelector, createSelector } from '@ngrx/store';
import { LobState } from '../reducers/workBookList.reducer';

export const selectLobState = createFeatureSelector<LobState>('workBookList');

export const selectLobList = createSelector(
    selectLobState,
    (state: LobState) => state.lobs
);

export const selectLobLoading = createSelector(
    selectLobState,
    (state: LobState) => state.loading
);

export const selectLobError = createSelector(
    selectLobState,
    (state: LobState) => state.error
);

//advance filter list
export const selectAdvanceFilters = createSelector(
    selectLobState,
    state => state.filters
);

//   export const selectDefaultFilterId = createSelector(
//     selectLobState,
//     state => state.defaultFilterId
//   );

export const selectFilterLoading = createSelector(
    selectLobState,
    state => state.loading
);

export const selectFilterError = createSelector(
    selectLobState,
    state => state.error
);
