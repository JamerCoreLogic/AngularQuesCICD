
import { createAction, props } from '@ngrx/store';

//for BOB List
export const loadBobList = createAction(
    '[Quote] Load Bob List',
    props<{ request: any; enabledForkJoin: boolean }>()
);

export const loadBobListSuccess = createAction(
    '[Quote] Load Bob List Success',
    props<{ data: any; totalItem: number }>()
);

export const loadBobListFailure = createAction(
    '[Quote] Load Bob List Failure',
    props<{ error: any }>()
);

//for parameter data
export const loadParameters = createAction(
    '[Parameter] Load Parameters',
    props<{ userId: number }>()
);

export const loadParametersSuccess = createAction(
    '[Parameter] Load Parameters Success',
    props<{ parameterdata: any }>()
);

export const loadParametersFailure = createAction(
    '[Parameter] Load Parameters Failure',
    props<{ error: any }>()
);

//for Agent List
export const loadAgents = createAction(
    '[Agents] Load Agents',
    props<{ userId: number; agentId: number }>()
);

export const loadAgentsSuccess = createAction(
    '[Agents] Load Agents Success',
    props<{ agents: any }>()
);

export const loadAgentsFailure = createAction(
    '[Agents] Load Agents Failure',
    props<{ error: any }>()
);

//for LOB list
export const loadLobList = createAction(
    '[LOB] Load Lob List',
    props<{ userId: number }>()
);

export const loadLobListSuccess = createAction(
    '[LOB] Load Lob List Success',
    props<{ lobs: any[] }>()
);

export const loadLobListFailure = createAction(
    '[LOB] Load Lob List Failure',
    props<{ error: any }>()
);