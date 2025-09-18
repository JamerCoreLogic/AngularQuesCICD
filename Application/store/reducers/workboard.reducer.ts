import { createReducer, on } from "@ngrx/store";
import * as WorkboardActions from '../actions/workboard.action'; // Adjust the path as needed


export interface WorkboardState {
    data: any;
    loading: boolean;
    loaded: boolean;   // ✅ helps us avoid duplicate API calls
    error: any;
    programs: any[];
    quotes: any[];
    totalItem: number;
    noRecordsMessage: string;
}

export const initialState: WorkboardState = {
    data: null,
    loading: false,
    loaded: false,
    error: null,
    programs: [],
    quotes: [],
    totalItem: 0,
    noRecordsMessage: '',
};

export const workboardReducer = createReducer(
    initialState,

    // Load Workboard
    on(WorkboardActions.loadWorkboard, (state) => ({
        ...state,
        loading: true,
        error: null,
    })),
    on(WorkboardActions.loadWorkboardSuccess, (state, { data }) => ({
        ...state,
        data,
        loading: false,
        loaded: data?.message === 'Success',  // ✅ only mark loaded if success
        error: null,
    })),
    on(WorkboardActions.loadWorkboardFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error,
    })),

    // Load MGA Programs
    on(WorkboardActions.loadMGAPrograms, state => ({
        ...state,
        loading: true,
        error: null,
    })),

    on(WorkboardActions.loadMGAProgramsSuccess, (state, { programs }) => ({
        ...state,
        programs,
        loading: false,
    })),

    on(WorkboardActions.loadMGAProgramsFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error,
    })),

    // Load Quotes
    on(WorkboardActions.loadQuotes, state => ({
        ...state,
        loading: true,
        error: null,
        noRecordsMessage: ''
    })),

    on(WorkboardActions.loadQuotesSuccess, (state, { quotes, totalItem }) => ({
        ...state,
        quotes,
        totalItem,
        loading: false,
        noRecordsMessage: quotes.length > 0 ? '' : 'No records found!'
    })),

    on(WorkboardActions.loadQuotesFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error,
        quotes: [],
        noRecordsMessage: 'No records found!'
    }))
);