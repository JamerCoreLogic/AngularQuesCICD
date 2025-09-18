import { IFormsListRequest } from '@agenciiq/aqforms';
import { createAction, props } from '@ngrx/store';

export const loadMGAPrograms = createAction(
    '[MGA Programs] Load MGA Programs',
    props<{ userId: number }>()
);

export const loadMGAProgramsSuccess = createAction(
    '[MGA Programs] Load MGA Programs Success',
    props<{ programs: any[] }>()
);

export const loadMGAProgramsFailure = createAction(
    '[MGA Programs] Load MGA Programs Failure',
    props<{ error: any }>()
);