import { createReducer, on } from '@ngrx/store';
import * as AlfredActions from '../actions/alfred-alert.action';

export interface AlfredState {
    alerts: any[];
    loading: boolean;
    error: any;
}

export const initialState: AlfredState = {
    alerts: [],
    loading: false,
    error: null,
};

export const alfredReducer = createReducer(
    initialState,
    on(AlfredActions.loadAlfredAlerts, (state) => ({
        ...state,
        loading: true,
        error: null
    })),
    on(AlfredActions.loadAlfredAlertsSuccess, (state, { alerts }) => ({
        ...state,
        alerts,
        loading: false
    })),
    on(AlfredActions.loadAlfredAlertsFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error
    }))
);
