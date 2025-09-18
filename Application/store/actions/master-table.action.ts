import { createAction, props } from '@ngrx/store';

//get All parameter list
export const loadParameterKeys = createAction(
    '[Parameter] Load Parameter Keys',
    props<{ userId: number }>()
);

export const loadParameterKeysSuccess = createAction(
    '[Parameter] Load Parameter Keys Success',
    props<{ parameterList: { parameterAlias: string; parameterKey: string }[] }>()
);

export const loadParameterKeysFailure = createAction(
    '[Parameter] Load Parameter Keys Failure',
    props<{ error: any }>()
);


//get data by parameter ID
export const loadParametersByKey = createAction(
    '[Parameter] Load Parameters By Key',
    props<{ userId: any, parameterAlias: string }>()
);

export const loadParametersByKeySuccess = createAction(
    '[Parameter] Load Parameters By Key Success',
    props<{ details: {} }>()
);

export const loadParametersByKeyFailure = createAction(
    '[Parameter] Load Parameters By Key Failure',
    props<{ error: any }>()
);