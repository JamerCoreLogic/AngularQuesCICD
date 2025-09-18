// kpi.reducer.ts
import { createReducer, on } from '@ngrx/store';
import * as agentDashboardActions from '../actions/agent-dashboard.action';

export interface KpiState {
    data: any;
    error: any;
    config: any | null;
    loading: boolean;
}

const initialState: KpiState = {
    data: null,
    error: null,
    config: null,
    loading: false
};

export const kpiReducer = createReducer(
    initialState,
    on(agentDashboardActions.loadKpi, (state) => ({
        ...state,
        error: null
    })),
    on(agentDashboardActions.loadKpiSuccess, (state, { response }) => ({
        ...state,
        data: response
    })),
    on(agentDashboardActions.loadKpiFailure, (state, { error }) => ({
        ...state,
        error
    })),

    //for MGA Config
    on(agentDashboardActions.loadMGAConfig, (state) => ({
        ...state,
        loading: true,
        error: null
    })),

    on(agentDashboardActions.loadMGAConfigSuccess, (state, { config }) => ({
        ...state,
        loading: false,
        config
    })),

    on(agentDashboardActions.loadMGAConfigFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error
    }))
);
