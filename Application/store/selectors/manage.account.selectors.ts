import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ManageAccountState } from 'store/reducers/manage.account.reduce';

export const selectManageAccountState = createFeatureSelector<ManageAccountState>('accountDetails'); // Key in StoreModule


export const getManageAccountDetails= createSelector(
    selectManageAccountState,
    (state: ManageAccountState) => state.accountDetails
);


export const selectFilteredManageAccount = createSelector(
    selectManageAccountState,
    (state: ManageAccountState) =>{
     return  state.accountDetails
    }
);

// No record message
export const selectManageAccountNoRecordMessage = createSelector(
    selectFilteredManageAccount,
    (accountDetails) => accountDetails ? '' : 'No Record Found.'
);
