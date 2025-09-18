import { createReducer, on } from "@ngrx/store";
import * as QuoteActions from '../actions/quote.actions';
import { Quote } from "src/app/modules/quotes/quote.model";


export interface QuoteState {
    quotes: Quote[];
    error: any;
    lobs: any[];
    mgaProgramList: any[];
    filters: any[];
    defaultFilterId: string | null;
}
export const initialState: QuoteState = {
    quotes: [],
    error: null,
    lobs: [],
    mgaProgramList: [],
    filters: [],
    defaultFilterId: null,
};

export const quoteReducer = createReducer(
    initialState,
    on(QuoteActions.loadQuoteList, (state) => ({
        ...state,
        loading: true
    })),
    on(QuoteActions.loadQuoteListSuccess, (state, { quoteList }) => ({
        ...state,
        quotes: quoteList,
        loading: false
    })),
    on(QuoteActions.loadQuoteListFailure, (state, { error }) => ({
        ...state,
        error,
        loading: false
    })),
    on(QuoteActions.loadLobList, (state) => ({
        ...state,
        loading: true
    })),
    on(QuoteActions.loadLOBListSuccess, (state, { lobList }) => ({
        ...state,
        lobs: lobList,
        loading: false
    })),
    on(QuoteActions.loadLOBListFailure, (state, { error }) => ({
        ...state,
        error,
        loading: false
    })),
    on(QuoteActions.loadMGAProgramList, (state) => ({
        ...state,
        loading: true
    })),
    on(QuoteActions.loadMGAProgramListSuccess, (state, { mgaProgramList }) => ({
        ...state,
        mgaProgramList: mgaProgramList,
        loading: false
    })),
    on(QuoteActions.loadMGAProgramListFailure, (state, { error }) => ({
        ...state,
        error,
        loading: false
    })),

    on(QuoteActions.loadFilters, (state) => ({
        ...state,
        loading: true,
        error: null
    })),
    on(QuoteActions.loadFiltersSuccess, (state, { filters }) => {
        const defaultFilter = filters.find(f => f.isDefault);
        return {
            ...state,
            filters,
            defaultFilterId: defaultFilter ? defaultFilter.advancedFilterId : null,
            loading: false,
        };
    }),
    on(QuoteActions.loadFiltersFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error,
    }))
);