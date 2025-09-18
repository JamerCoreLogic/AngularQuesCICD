import { createReducer, on } from '@ngrx/store';
import * as InsuredProspectsActions from '../actions/insured.actions';

export interface InsuredProspectsState {
    data: any[];
    loading: boolean;
    error: any;
}

export const initialState: InsuredProspectsState = {
    data: [],
    loading: false,
    error: null
};

export const insuredProspectsReducer = createReducer(
    initialState,

    on(InsuredProspectsActions.loadInsuredProspects, (state) => ({
        ...state,
        loading: true,
        error: null
    })),

    on(InsuredProspectsActions.loadInsuredProspectsSuccess, (state, { data }) => ({
        ...state,
        loading: false,
        data
    })),

    on(InsuredProspectsActions.loadInsuredProspectsFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error
    }))
);