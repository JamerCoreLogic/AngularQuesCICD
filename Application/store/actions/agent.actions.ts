import { createAction, props } from "@ngrx/store";


//get Agent List
export const loadAgentList = createAction(
    '[Agent] Load Agent List',
    props<{
        userId: number;
        agencyId: number;
        agencyName?: string;
        managerName?: string;
        supervisorName?: string;
        isActive?: boolean;
    }>()
);

export const loadAgentListSuccess = createAction(
    '[Agent] Load Agent List Success',
    props<{ agentList: any[]; }>()
);

export const loadAgentListFailure = createAction(
    '[Agent] Load Agent List Failure',
    props<{ error: any }>()
);