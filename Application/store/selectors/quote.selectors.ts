import { createFeatureSelector, createSelector } from '@ngrx/store';
import { QuoteState } from 'store/reducers/quote.reducer';

export const selectQuoteState = createFeatureSelector<QuoteState>('quotes'); // Key in StoreModule
export const selectLobState = createFeatureSelector<QuoteState>('lob'); // Key in StoreModule
export const selectMgaProgramState = createFeatureSelector<QuoteState>('magProgramList'); // Key in StoreModule
export const selectFilterState = createFeatureSelector<QuoteState>('filters');

// All agents
export const selectAllAgents = createSelector(
  selectQuoteState,
  (state: QuoteState) => {
    return state.quotes
  }
);

// Filtered quotes
export const selectFilteredQuotes = createSelector(
  selectQuoteState,
  (state: QuoteState) => {
    return state.quotes
  }
);

// No record message
export const selectQuoteNoRecordMessage = createSelector(
  selectFilteredQuotes,
  (quotes) => quotes.length > 0 ? '' : 'No Record Found.'
);

export const selectAllLob = createSelector(
  selectLobState,
  (state: QuoteState) => {
    return state.lobs
  }
);

// Filtered lobs
export const selectFilteredLob = createSelector(
  selectQuoteState,
  (state: QuoteState) => {
    return state.lobs
  }
);

// No record message
export const selectLobNoRecordMessage = createSelector(
  selectFilteredQuotes,
  (lobs) => lobs.length > 0 ? '' : 'No Record Found.'
);


export const selectAllMgaProgram = createSelector(
  selectMgaProgramState,
  (state: QuoteState) => {
    return state.mgaProgramList
  }
);

// Filtered mga programs
export const selectFilteredMgaProgram = createSelector(
  selectQuoteState,
  (state: QuoteState) => {
    return state.mgaProgramList
  }
);

// No record message
export const selectMgaProgramNoRecordMessage = createSelector(
  selectFilteredQuotes,
  (mgaProgramList) => mgaProgramList.length > 0 ? '' : 'No Record Found.'
);


export const selectAllFilters = createSelector(
  selectFilterState,
  (state: QuoteState) => state.filters
);

export const selectDefaultFilterId = createSelector(
  selectFilterState,
  (state: QuoteState) => state.defaultFilterId
);