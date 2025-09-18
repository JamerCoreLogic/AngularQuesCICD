import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AlfredState } from '../reducers/alfred-alert.reducer';

export const selectAlfredState = createFeatureSelector<AlfredState>('alfred');

export const selectAlfredAlerts = createSelector(
    selectAlfredState,
    (state) => state.alerts
);

export const selectAlfredLoading = createSelector(
    selectAlfredState,
    (state) => state.loading
);

export const selectAlfredError = createSelector(
    selectAlfredState,
    (state) => state?.error
);

// No record message
export const selectAlfredNoRecordMessage = createSelector(
    selectAlfredAlerts,
    (responses) => responses.length > 0 ? '' : 'No alfred-alert data found.'
);