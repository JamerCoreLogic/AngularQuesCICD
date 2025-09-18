
import { createReducer, on } from "@ngrx/store";
import * as BobActions from '../actions/bookTransfer.action'

export interface BobState {
    dataSource: any[];
    totalItem: number;
    loading: boolean;
    error: any;
    noRecordsMessage: string;
    parameterdata: any | null;
    agents: any[];
    lobs: any[];
}

export const initialState: BobState = {
    dataSource: [],
    totalItem: 0,
    loading: false,
    error: null,
    noRecordsMessage: '',
    parameterdata: null,
    agents: [],
    lobs: [],
};

export const bobReducer = createReducer(
    initialState,


    //for BoB List
    on(BobActions.loadBobList, (state) => ({
        ...state,
        loading: true,
        error: null,
        noRecordsMessage: ''
    })),

    on(BobActions.loadBobListSuccess, (state, { data, totalItem }) => ({
        ...state,
        dataSource: data,
        totalItem,
        loading: false,
        error: null,
        noRecordsMessage: data?.length ? '' : 'No records found!'
    })),

    on(BobActions.loadBobListFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error,
        dataSource: [],
        noRecordsMessage: 'Failed to load records. Please try again.'
    })),

    //for parameter data
    on(BobActions.loadParameters, state => ({
        ...state,
        loading: true,
        error: null
    })),

    on(BobActions.loadParametersSuccess, (state, { parameterdata }) => ({
        ...state,
        parameterdata,
        loading: false
    })),

    on(BobActions.loadParametersFailure, (state, { error }) => ({
        ...state,
        error,
        loading: false
    })),

    //for Agent List
    on(BobActions.loadAgents, state => ({
        ...state,
        loading: true,
        error: null
    })),

    on(BobActions.loadAgentsSuccess, (state, { agents }) => ({
        ...state,
        agents,
        loading: false
    })),

    on(BobActions.loadAgentsFailure, (state, { error }) => ({
        ...state,
        error,
        loading: false
    })),

    //for LOB list
    on(BobActions.loadLobList, state => ({
        ...state,
        loading: true,
        error: null
    })),
    on(BobActions.loadLobListSuccess, (state, { lobs }) => ({
        ...state,
        lobs,
        loading: false,
        error: null
    })),
    on(BobActions.loadLobListFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error
    }))

);