import { IQuoteViewReq } from "@agenciiq/quotes";
import { createAction, props } from "@ngrx/store";

export const loadQuoteList = createAction(
    '[Quote] Load Quote List',
    props<{
        request: IQuoteViewReq, enableForkJoin: boolean,
    }>()
);

export const loadQuoteListSuccess = createAction(
    '[Quote] Load Quote List Success',
    props<{ quoteList: any[]; }>()
);

export const loadQuoteListFailure = createAction(
    '[Quote] Load Quote List Failure',
    props<{ error: any }>()
);

export const loadLobList = createAction(
    '[LOB] Load LOB List',
    props<{ userId: number }>()
);

export const loadLOBListSuccess = createAction(
    '[LOB] Load LOB List Success',
    props<{ lobList: any[]; }>()
);

export const loadLOBListFailure = createAction(
    '[LOB] Load LOB List Failure',
    props<{ error: any }>()
);

export const loadMGAProgramList = createAction(
    '[MGAProgram] Load MGAProgram List',
    props<{ userId: number }>()
);

export const loadMGAProgramListSuccess = createAction(
    '[MGAProgram] Load MGAProgram List Success',
    props<{ mgaProgramList: any[]; }>()
);

export const loadMGAProgramListFailure = createAction(
    '[MGAProgram] Load MGAProgram List Failure',
    props<{ error: any }>()
);

export const loadFilters = createAction(
    '[Filter] Load Filters',
    props<{ userId: string, agentId: number }>()
);

export const loadFiltersSuccess = createAction(
    '[Filter] Load Filters Success',
    props<{ filters: any[] }>()
);

export const loadFiltersFailure = createAction(
    '[Filter] Load Filters Failure',
    props<{ error: any }>()
);