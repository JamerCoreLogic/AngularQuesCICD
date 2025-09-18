import { createReducer, on } from '@ngrx/store';
import * as CarrierActions from '../actions/carrier-list.actions';

export interface CarrierState {
    carrierList: any;
    loading: boolean;
    error: any;
}

export const initialState: CarrierState = {
    carrierList: null,
    loading: false,
    error: null
};

export const carrierReducer = createReducer(
    initialState,

    on(CarrierActions.loadCarrierList, state => ({
        ...state,
        loading: true,
        error: null
    })),

    on(CarrierActions.loadCarrierListSuccess, (state, { carrierList }) => ({
        ...state,
        loading: false,
        carrierList
    })),

    on(CarrierActions.loadCarrierListFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error
    }))
);
