import { createAction, props } from '@ngrx/store';

export const loadPeriodTypes = createAction('[Workboard] Load Period Types');

export const loadPeriodTypesSuccess = createAction(
    '[Workboard] Load Period Types Success',
    props<{ workboardResponse: any }>()
);

export const loadPeriodTypesFailure = createAction(
    '[Workboard] Load Period Types Failure',
    props<{ error: any }>()
);
