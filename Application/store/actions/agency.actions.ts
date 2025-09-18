import { AgencyAdmin } from 'src/app/modules/agency/agency-admin-model';
import { createAction, props } from '@ngrx/store';

//get Agency List
export const loadAgencyList = createAction(
  '[Agency] Load List',
  props<{ userId: number, agencyId: number, agentId: number, registerType: 'Yes' | 'No' }>()
);

export const loadAgencyListSuccess = createAction(
  '[Agency] Load List Success',
  props<{ agencyList: any; registerType: 'Yes' | 'No' }>()
);

export const loadAgencyListFailure = createAction(
  '[Agency] Load List Failure',
  props<{ error: any }>()
);