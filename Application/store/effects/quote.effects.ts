import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { LoaderService } from 'src/app/shared/utility/loader/loader.service';
import * as QuoteActions from '../actions/quote.actions';
import { AQQuotesListService, AQSaveAdvanceFilterService, LOBService } from '@agenciiq/quotes';
import { ProgramService } from '@agenciiq/aqadmin';
import { AdvanceFilterType } from 'src/app/global-settings/advance-filter-type';

@Injectable()
export class Quoteffects {
  constructor(
    private actions$: Actions,
    private quote: AQQuotesListService,
    private loader: LoaderService,
    private lobService: LOBService,
    private _programService: ProgramService,
    private saveFilterService: AQSaveAdvanceFilterService
  ) { }

  // Quote List Effect
  loadQuoteList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(QuoteActions.loadQuoteList),
      //tap(() => this.loader.show()),
      switchMap(({ request, enableForkJoin }) =>
        this.quote.QuotesViewList(request, enableForkJoin).pipe(
          map(response => {
            const quote = response[0]?.data?.quote;
            return QuoteActions.loadQuoteListSuccess({ quoteList: quote as any });
          }),
          catchError(error =>
            of(QuoteActions.loadQuoteListFailure({ error }))
          )
        )
      )
    )
  );


  // Load LOB List Effect
  loadLobList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(QuoteActions.loadLobList),
      //tap(() => this.loader.show()),
      switchMap(({ userId }) =>
        this.lobService.GetLOBList(userId).pipe(
          map(response => {
            const lob = response.data.lobsList;
            return QuoteActions.loadLOBListSuccess({ lobList: lob as any });
          }),
          catchError(error =>
            of(QuoteActions.loadLOBListFailure({ error }))
          )
        )
      )
    )
  );

  // Load MGA Program List Effect
  loadMGAProgramList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(QuoteActions.loadMGAProgramList),
      //tap(() => this.loader.show()),
      switchMap(({ userId }) =>
        this._programService.MGAPrograms(userId, 1).pipe(
          map(response => {
            const mgaProgram = response.data.mgaProgramList;
            return QuoteActions.loadMGAProgramListSuccess({ mgaProgramList: mgaProgram as any });
          }),
          catchError(error =>
            of(QuoteActions.loadMGAProgramListFailure({ error }))
          )
        )
      )
    )
  );


  loadFilters$ = createEffect(() =>
    this.actions$.pipe(
      ofType(QuoteActions.loadFilters),
      switchMap(({ userId, agentId }) =>
        this.saveFilterService.GetAdvanceFilterParameter(AdvanceFilterType.quotesFilter, userId, agentId).pipe(
          map(parameters =>
            QuoteActions.loadFiltersSuccess({
              filters: parameters?.data?.advancedFilterList || []
            })
          ),
          catchError(error => of(QuoteActions.loadFiltersFailure({ error })))
        )
      )
    )
  );


  hideLoader$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          QuoteActions.loadQuoteListSuccess,
          QuoteActions.loadQuoteListFailure,
          QuoteActions.loadLOBListSuccess,
          QuoteActions.loadLOBListFailure,
          QuoteActions.loadMGAProgramListSuccess,
          QuoteActions.loadMGAProgramListFailure
        ),
        //tap(() => this.loader.hide())
      ),
    { dispatch: false }
  );
}
