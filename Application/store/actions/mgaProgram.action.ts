import { createAction, props } from '@ngrx/store';

export const loadMGAPrograms = createAction(
    '[Program] Load MGA Programs',
    props<{ userId: any; agencyId: number }>()
);

export const loadMGAProgramsSuccess = createAction(
    '[Program] Load MGA Programs Success',
    props<{ programs: any }>()
);

export const loadMGAProgramsFailure = createAction(
    '[Program] Load MGA Programs Failure',
    props<{ error: any }>()
);
