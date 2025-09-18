import { createReducer, on } from '@ngrx/store';
import * as AgencyActions from '../actions/agency.actions';
import { AgencyAdmin } from 'src/app/modules/agency/agency-admin-model';
// import { IAgencyListDetail } from '@agenciiq/agency/lib/interfaces/base-new-agency-list-resp';

// export interface AgencyState {
//   agencies: AgencyAdmin[];
//   loading: boolean;
//   error: any;
// }

// export const initialState: AgencyState = {
//   agencies: [],
//   loading: false,
//   error: null,
// };
///////////////////////
export interface AgencyState {
  agencies: any;
  //   registerType: 'Yes' | 'No' | null;
  error: any;
}

export const initialState: AgencyState = {
  agencies: null,
  //   registerType: null,
  error: null,
};

export const agencyReducer = createReducer(
  initialState,
  on(AgencyActions.loadAgencyListSuccess, (state, { agencyList, registerType }) => ({
    ...state,
    agencies: agencyList,
    // registerType,
    error: null,
  })),
  on(AgencyActions.loadAgencyListFailure, (state, { error }) => ({
    ...state,
    error
  }))
);

// ////////////////////////
// export const projectReducer = createReducer(
//   initialState,
//   on(AgencyActions.loadAgencies, state => ({
//     ...state,
//     loading: true,
//     error: null,
//   })),
//   on(AgencyActions.loadAgenciesSuccess, (state, { agencies }) => ({
//     ...state,
//     loading: false,
//     agencies,
//   })),
//   on(AgencyActions.loadAgenciesFailure, (state, { error }) => ({
//     ...state,
//     loading: false,
//     error,
//   }))
// );