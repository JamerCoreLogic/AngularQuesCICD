import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CarrierState } from '../reducers/carrier-list.reducer';

export const selectCarrierState = createFeatureSelector<CarrierState>('carrierList');

export const selectCarrierList = createSelector(
    selectCarrierState,
    (state: CarrierState) => state.carrierList
);

export const selectCarrierLoading = createSelector(
    selectCarrierState,
    (state: CarrierState) => state.loading
);

export const selectCarrierError = createSelector(
    selectCarrierState,
    (state: CarrierState) => state.error
);
