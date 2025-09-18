import { createAction, props } from '@ngrx/store';

export const loadLobs = createAction(
    '[LOB] Load LOBs',
    props<{ userId: number }>()
);

export const loadLobsSuccess = createAction(
    '[LOB] Load LOBs Success',
    props<{ lobs: any }>()
);

export const loadLobsFailure = createAction(
    '[LOB] Load LOBs Failure',
    props<{ error: any }>()
);


//advance filter list
export const loadAdvanceFilters = createAction(
    '[Filter] Load Advance Filters',
    props<{ filterType: string; userId: string; agentId: number }>()
);

export const loadAdvanceFiltersSuccess = createAction(
    '[Filter] Load Advance Filters Success',
    props<{ filters: any }>()
);

export const loadAdvanceFiltersFailure = createAction(
    '[Filter] Load Advance Filters Failure',
    props<{ error: any }>()
);
