import { createAction, props } from '@ngrx/store';

export const loadCarrierList = createAction(
    '[Carrier] Load Carrier List',
    props<{ userId: number; savedCarrierList: any[] }>()
);

export const loadCarrierListSuccess = createAction(
    '[Carrier] Load Carrier List Success',
    props<{ carrierList: any }>()
);

export const loadCarrierListFailure = createAction(
    '[Carrier] Load Carrier List Failure',
    props<{ error: any }>()
);
