import { createReducer, on } from "@ngrx/store";
import * as ManageAccountActions from '../actions/manage.account.actions'


export interface ManageAccountState {
    accountDetails: {};
    error: any;
}
export const initialState: ManageAccountState = {
    accountDetails: {},
    error: null,
};

export const manageAccountReducer = createReducer(
    initialState,
    on(ManageAccountActions.loadAccountDetails, (state) => ({
        ...state,
        loading: true
    })),
    on(ManageAccountActions.loadAccountDetailsSuccess, (state, { accountDetails }) => ({
        ...state,
        accountDetails: accountDetails,
        loading: false
    })),
    on(ManageAccountActions.loadAccountDetailsFailure, (state, { error }) => ({
        ...state,
        error,
        loading: false
    }))
);