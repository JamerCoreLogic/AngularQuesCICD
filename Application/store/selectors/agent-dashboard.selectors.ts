import { createFeatureSelector, createSelector } from '@ngrx/store';
import { KpiState } from '../reducers/agent-dashboard.reducer';

// 👇 First create a feature selector (key must match StoreModule.forFeature key)
export const selectKpiState = createFeatureSelector<KpiState>('kpi');

// All KPI responses
export const selectAllKpiResponses = createSelector(
    selectKpiState,
    (state: KpiState) => state?.data
);

// KPI responses filtered by type (example with props)
export const selectFilteredKpiResponses = createSelector(
    selectAllKpiResponses,
    (responses, props: { kpiType: string }) =>
        responses.filter(r => r.type === props.kpiType)
);

// Error message
export const selectKpiError = createSelector(
    selectKpiState,
    (state: KpiState) => state?.error
);

// No record message
export const selectKpiNoRecordMessage = createSelector(
    selectAllKpiResponses,
    (responses) => responses.length > 0 ? '' : 'No KPI data found.'
);

// Selectors for MGA Config
export const selectMGAConfig = createSelector(
    selectKpiState,
    (state) => state.config
);

export const selectMGAConfigLoading = createSelector(
    selectKpiState,
    (state) => state.loading
);

export const selectMGAConfigError = createSelector(
    selectKpiState,
    (state) => state.error
);

