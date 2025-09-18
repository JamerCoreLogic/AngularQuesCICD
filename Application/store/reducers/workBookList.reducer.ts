import { createReducer, on } from '@ngrx/store';
import * as WorkBookActions from '../actions/workBookList.action';

export interface LobState {
    lobs: any[];
    filters: any[];
    loading: boolean;
    error: any;
}

export const initialState: LobState = {
    lobs: [],
    filters: [],
    loading: false,
    error: null
};

export const workBookReducer = createReducer(
    initialState,
    on(WorkBookActions.loadLobs, state => ({
        ...state,
        loading: true,
        error: null
    })),
    on(WorkBookActions.loadLobsSuccess, (state, { lobs }) => ({
        ...state,
        lobs,
        loading: false
    })),
    on(WorkBookActions.loadLobsFailure, (state, { error }) => ({
        ...state,
        error,
        loading: false
    })),
    on(WorkBookActions.loadAdvanceFilters, state => ({
        ...state,
        loading: true,
        error: null
    })),
    // on(WorkBookActions.loadAdvanceFiltersSuccess, (state, { filters }) => {
    //     const defaultFilter = filters.find(f => f.isDefault);
    //     return {
    //         ...state,
    //         filters,
    //         defaultFilterId: defaultFilter ? defaultFilter.advancedFilterId : null,
    //         loading: false
    //     };
    // }),
    on(WorkBookActions.loadAdvanceFiltersSuccess, (state, { filters }) => ({
        ...state,
        filters,
        loading: false
    })),
    on(WorkBookActions.loadAdvanceFiltersFailure, (state, { error }) => ({
        ...state,
        error,
        loading: false
    }))
);
