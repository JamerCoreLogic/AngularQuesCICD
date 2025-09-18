import { AqworkboardServiceService } from "@agenciiq/aqworkboard";
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, switchMap } from "rxjs/operators";
import * as WorkboardActions from '../actions/workboard.action'; // Adjust the path as needed
import { of } from "rxjs";
import { ProgramService } from "@agenciiq/aqadmin";
import { AQQuotesListService } from "@agenciiq/quotes";


@Injectable()
export class WorkboardEffects {
    constructor(private actions$: Actions,
        private workboardService: AqworkboardServiceService,
        private programService: ProgramService,
        private quotesService: AQQuotesListService,) { }

    // Effect to load workboard data
    loadWorkboard$ = createEffect(() =>
        this.actions$.pipe(
            ofType(WorkboardActions.loadWorkboard),
            switchMap(({ period, startDate, endDate, agentId, userId }) =>
                this.workboardService.newWorkboardList(period, startDate, endDate, 0, agentId, userId, '').pipe(
                    map((response: any) => WorkboardActions.loadWorkboardSuccess(
                        { data: response })),
                    catchError((error) => of(WorkboardActions.loadWorkboardFailure({ error })))
                )
            )
        )
    );

    // Effect to load MGA programs
    loadMGAPrograms$ = createEffect(() =>
        this.actions$.pipe(
            ofType(WorkboardActions.loadMGAPrograms),
            switchMap(({ userId, agencyId }) =>
                this.programService.MGAPrograms(userId, agencyId).pipe(
                    map(resp => {
                        const programs = resp?.data?.mgaProgramList || [];
                        return WorkboardActions.loadMGAProgramsSuccess({ programs });
                    }),
                    catchError(error => of(WorkboardActions.loadMGAProgramsFailure({ error })))
                )
            )
        )
    );

    // Effect to load quotes
    loadQuotes$ = createEffect(() =>
        this.actions$.pipe(
            ofType(WorkboardActions.loadQuotes),
            switchMap(({ request, enabledForkJoin }) =>
                this.quotesService.QuotesViewList(request, enabledForkJoin).pipe(
                    map(resp => {
                        const quotes = resp[0]?.data?.quote || [];
                        const totalItem = enabledForkJoin && resp[1] ? resp[1].totalQuote : 0;

                        return WorkboardActions.loadQuotesSuccess({ quotes, totalItem });
                    }),
                    catchError(error => of(WorkboardActions.loadQuotesFailure({ error })))
                )
            )
        )
    );
}