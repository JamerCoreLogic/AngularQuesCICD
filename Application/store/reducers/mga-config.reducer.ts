import { createReducer, on } from "@ngrx/store";
import * as mgaConfigActions from '../actions/mga-config.action';

export interface MGAState {
    configuration: any;
    lobs: any[];
    carriers: any[];
    states: any[];
    loading: boolean;
    error: any;
}

export const initialMGAState: MGAState = {
    configuration: null,
    lobs: [],
    carriers: [],
    states: [],
    loading: false,
    error: null
};

export const mgaReducer = createReducer(
    initialMGAState,

    on(mgaConfigActions.loadMGADetails, (state) => ({
        ...state,
        loading: true,
        error: null
    })),

    on(mgaConfigActions.loadMGADetailsSuccess, (state, { data }) => ({
        ...state,
        configuration: data.mgaConfiguration,
        lobs: data.mgaLobsList,
        carriers: data.mgaCarriersList,
        states: data.mgaStatesList,
        loading: false
    })),

    on(mgaConfigActions.loadMGADetailsFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error
    }))
);