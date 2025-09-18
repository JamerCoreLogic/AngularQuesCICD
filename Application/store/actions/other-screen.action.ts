import { IFormsListRequest } from '@agenciiq/aqforms';
import { createAction, props } from '@ngrx/store';

export const loadFormsList = createAction(
    '[Forms] Load Forms List',
    props<{ request: IFormsListRequest; selectedScreen: string }>()
);

export const loadFormsListSuccess = createAction(
    '[Forms] Load Forms List Success',
    props<{ forms: any[] }>()
);

export const loadFormsListFailure = createAction(
    '[Forms] Load Forms List Failure',
    props<{ error: any }>()
);


// Actions for loading form types (parameters)
export const loadFormTypes = createAction(
    '[Parameter] Load Form Types',
    props<{ userId: number }>()
);

export const loadFormTypesSuccess = createAction(
    '[Parameter] Load Form Types Success',
    props<{ formTypes: any }>()
);

export const loadFormTypesFailure = createAction(
    '[Parameter] Load Form Types Failure',
    props<{ error: any }>()
);