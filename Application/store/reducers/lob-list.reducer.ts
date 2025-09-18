import { createReducer, on } from '@ngrx/store';
import * as LobActions from '../actions/lob-list.action';

export interface LobState {
    lobList: any[];
    loading: boolean;
    error: any;
}

export const initialState: LobState = {
    lobList: [],
    loading: false,
    error: null
};

export const lobReducer = createReducer(
    initialState,

    on(LobActions.loadLobList, state => ({
        ...state,
        loading: true,
        error: null
    })),

    on(LobActions.loadLobListSuccess, (state, { lobList }) => ({
        ...state,
        loading: false,
        lobList
    })),

    on(LobActions.loadLobListFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error
    }))
);
