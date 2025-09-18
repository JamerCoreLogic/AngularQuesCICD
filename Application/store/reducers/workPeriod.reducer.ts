import { createReducer, on } from '@ngrx/store';
import * as WorkboardActions from '../actions/workPeriodType.actions';

export interface WorkboardState {
    workboardResponse: any[];
    monthList: any[];
    quarterList: any[];
    yearList: any[];
    loading: boolean;
    error: any;
}

export const initialState: WorkboardState = {
    workboardResponse: [],
    monthList: [],
    quarterList: [],
    yearList: [],
    loading: false,
    error: null,
};

export const workboardPeriodReducer = createReducer(
    initialState,
    on(WorkboardActions.loadPeriodTypes, state => ({
        ...state,
        loading: true,
        error: null
    })),
    on(WorkboardActions.loadPeriodTypesSuccess, (state, { workboardResponse }) => ({
        ...state,
        loading: false,
        workboardResponse
    })),
    on(WorkboardActions.loadPeriodTypesFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error
    }))
);
