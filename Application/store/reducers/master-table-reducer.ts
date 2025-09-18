import { createReducer, on } from '@ngrx/store';
import * as ParameterActions from '../actions/master-table.action';


export interface ParameterState {
    parameterList: { parameterAlias: string; parameterKey: string }[];
    loading: boolean;
    error: any;
    isParameterAddDisabled: boolean;
    details: {};
}

const initialState: ParameterState = {
    parameterList: [],
    details: {},
    loading: false,
    error: null,
    isParameterAddDisabled: false
};

export const parameterReducer = createReducer(
    initialState,

    // Load all parameter keys (alias list)
    on(ParameterActions.loadParameterKeys, (state) => ({
        ...state,
        loading: true,
        error: null,
    })),

    on(ParameterActions.loadParameterKeysSuccess, (state, { parameterList }) => ({
        ...state,
        parameterList,
        loading: false,
    })),

    on(ParameterActions.loadParameterKeysFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error,
    })),

    // Load parameters by key (filtered list)
    on(ParameterActions.loadParametersByKey, (state) => ({
        ...state,
        loading: true
    })),

    on(ParameterActions.loadParametersByKeySuccess, (state, { details }) => {
        if (details) {
            const aliasKeys = Object?.keys(details);
            const firstAlias = aliasKeys.length > 0 ? aliasKeys[0] : null;
            const paramList = firstAlias ? details[firstAlias] : [];
            const firstParam = paramList.length > 0 ? paramList[0] : null;
            return {
                ...state,
                details: { ...state.details, ...details },
                isParameterAddDisabled: firstParam ? firstParam.isParameterAddDisabled : false,
                loading: false
            };
        }
    }),

    on(ParameterActions.loadParametersByKeyFailure, (state, { error }) => ({
        ...state,
        error,
        filteredParameterList: [],
        loading: false
    }))
);



