import { createReducer, on } from "@ngrx/store";
import * as FormsActions from '../actions/other-screen.action';

export interface FormsState {
    forms: any[];
    loading: boolean;
    error: any;
    loaded: boolean;
    formTypes: any;
}

export const initialState: FormsState = {
    forms: [],
    loading: false,
    error: null,
    loaded: false,
    formTypes: null,
};

export const formsReducer = createReducer(
    initialState,

    on(FormsActions.loadFormsList, state => ({
        ...state,
        loading: true,
        error: null
    })),

    on(FormsActions.loadFormsListSuccess, (state, { forms }) => ({
        ...state,
        forms,
        loading: false,
        loaded: true,
    })),

    on(FormsActions.loadFormsListFailure, (state, { error }) => ({
        ...state,
        error,
        loading: false,
        loaded: false
    })),

    // Handlers for form types (parameters)
    on(FormsActions.loadFormTypes, state => ({
        ...state,
        loading: true,
        loaded: false,
        error: null
    })),

    on(FormsActions.loadFormTypesSuccess, (state, { formTypes }) => ({
        ...state,
        formTypes,
        loading: false,
        loaded: true
    })),

    on(FormsActions.loadFormTypesFailure, (state, { error }) => ({
        ...state,
        loading: false,
        loaded: false,
        error
    }))
);