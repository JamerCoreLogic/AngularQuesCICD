// kpi.actions.ts
import { createAction, props } from '@ngrx/store';

export const loadKpi = createAction(
    '[KPI] Load KPI',
    props<{
        userId: number;
        period: string;
        startDate: any;
        endDate: any;
        agentId: number
    }>()
);

export const loadKpiSuccess = createAction(
    '[KPI] Load KPI Success',
    props<{ response: any }>()
);

export const loadKpiFailure = createAction(
    '[KPI] Load KPI Failure',
    props<{ error: any }>()
);

//for MGA Config
export const loadMGAConfig = createAction(
    '[MGAConfig] Load MGA Config',
    props<{ userId: number }>()
);

export const loadMGAConfigSuccess = createAction(
    '[MGAConfig] Load MGA Config Success',
    props<{ config: any }>()
);

export const loadMGAConfigFailure = createAction(
    '[MGAConfig] Load MGA Config Failure',
    props<{ error: any }>()
);
