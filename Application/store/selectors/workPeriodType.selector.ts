import { createFeatureSelector, createSelector } from '@ngrx/store';
import { WorkboardState } from '../reducers/workPeriod.reducer';

export const selectWorkboardState = createFeatureSelector<WorkboardState>('workboardPeriod');

export const selectMonthList = createSelector(
    selectWorkboardState,
    state => state.monthList
);

export const selectWorkPeriodList = createSelector(
    selectWorkboardState,
    state => state.workboardResponse
);

export const selectQuarterList = createSelector(
    selectWorkboardState,
    state => state.quarterList
);

export const selectYearList = createSelector(
    selectWorkboardState,
    state => state.yearList
);

export const selectLoading = createSelector(
    selectWorkboardState,
    state => state.loading
);

export const selectError = createSelector(
    selectWorkboardState,
    state => state.error
);
