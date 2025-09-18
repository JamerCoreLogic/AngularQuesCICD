import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AgencyState } from '../reducers/agency.reducer';

// export const selectAgencyState = createFeatureSelector<AgencyState>('agencies');

// export const selectAllAgencies = createSelector(
//   selectAgencyState,
//   (state: AgencyState) => state.agencies
// );

// export const selectLoading = createSelector(
//   selectAgencyState,
//   (state: AgencyState) => state.loading
// );
//////////////////////////

export const selectAgencyState = createFeatureSelector<AgencyState>('agency');

// export const selectFilteredAgencies = createSelector(
//     selectAgencyState,
//     (state: AgencyState, props: { registerType: string }) =>
//         state.agencies.filter(item => item.registered === props.registerType)
// );

export const selectFilteredAgencies = createSelector(
  selectAgencyState,
  (state) => state.agencies
);

export const selectNoRecordMessage = createSelector(
  selectFilteredAgencies,
  agencies => agencies.length > 0 ? '' : 'No Record Found.'
);