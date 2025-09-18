import { createAction, props } from '@ngrx/store';

export const loadLobList = createAction(
    '[LOB] Load LOB List',
    props<{ userId: number; savedLobList: any[] }>()
);

export const loadLobListSuccess = createAction(
    '[LOB] Load LOB List Success',
    props<{ lobList: any[] }>()
);

export const loadLobListFailure = createAction(
    '[LOB] Load LOB List Failure',
    props<{ error: any }>()
);
