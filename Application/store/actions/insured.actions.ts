import { createAction, props } from '@ngrx/store';

export const loadInsuredProspects = createAction(
    '[InsuredProspects] Load InsuredProspects',
    props<{ userId: number; clientId: string }>()
);

export const loadInsuredProspectsSuccess = createAction(
    '[InsuredProspects] Load InsuredProspects Success',
    props<{ data: any[] }>()
);

export const loadInsuredProspectsFailure = createAction(
    '[InsuredProspects] Load InsuredProspects Failure',
    props<{ error: any }>()
);
