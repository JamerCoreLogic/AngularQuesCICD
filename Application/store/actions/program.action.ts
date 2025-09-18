import { createAction, props } from "@ngrx/store";

export const loadProgramList = createAction(
    '[Program] Load Program List',
    props<{
        userId: number;
        clientId: number;
        agencyName?: string;
        managerName?: string;
        supervisorName?: string;
        isActive?: boolean;
    }>()
);

export const loadProgramListSuccess = createAction(
    '[Program] Load Program List Success',
    props<{ programList: any[]; }>()
);

export const loadProgramListFailure = createAction(
    '[Program] Load Program List Failure',
    props<{ error: any }>()
);