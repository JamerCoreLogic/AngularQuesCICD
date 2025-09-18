import { IQuoteViewReq } from "@agenciiq/quotes";
import { createAction, props } from "@ngrx/store";

//for loading workboard data
export const loadWorkboard = createAction(
    '[Workboard] Load Workboard',
    props<{ period: string; startDate: Date; endDate: Date; agentId: number; userId: string }>()
);

export const loadWorkboardSuccess = createAction(
    '[Workboard] Load Workboard Success',
    props<{ data: any }>()
);

export const loadWorkboardFailure = createAction(
    '[Workboard] Load Workboard Failure',
    props<{ error: any }>()
);

//for loading MGA programs
export const loadMGAPrograms = createAction(
    '[MGA] Load Programs',
    props<{ userId: number; agencyId: number }>()   // params for API
);

export const loadMGAProgramsSuccess = createAction(
    '[MGA] Load Programs Success',
    props<{ programs: any[] }>()
);

export const loadMGAProgramsFailure = createAction(
    '[MGA] Load Programs Failure',
    props<{ error: any }>()
);

//for loading quotes
export const loadQuotes = createAction(
    '[Quotes] Load Quotes',
    props<{ request: IQuoteViewReq; enabledForkJoin: boolean }>()
);

export const loadQuotesSuccess = createAction(
    '[Quotes] Load Quotes Success',
    props<{ quotes: any[]; totalItem: number }>()
);

export const loadQuotesFailure = createAction(
    '[Quotes] Load Quotes Failure',
    props<{ error: any }>()
);