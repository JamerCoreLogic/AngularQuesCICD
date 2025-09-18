import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as WorkBookActions from '../actions/workBookList.action';
import { switchMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { AQSaveAdvanceFilterService, LOBService } from '@agenciiq/quotes';

@Injectable()
export class WorkBookEffects {
    constructor(private actions$: Actions, private lobService: LOBService, private saveFilterService: AQSaveAdvanceFilterService,) { }

    loadLobs$ = createEffect(() =>
        this.actions$.pipe(
            ofType(WorkBookActions.loadLobs),
            switchMap(({ userId }) =>
                this.lobService.GetLOBList(userId).pipe(
                    map(response =>
                        WorkBookActions.loadLobsSuccess({
                            lobs: response
                        })
                    ),
                    catchError(error =>
                        of(WorkBookActions.loadLobsFailure({ error }))
                    )
                )
            )
        )
    );


    loadAdvanceFilters$ = createEffect(() =>
        this.actions$.pipe(
            ofType(WorkBookActions.loadAdvanceFilters),
            switchMap(({ filterType, userId, agentId }) =>
                this.saveFilterService.GetAdvanceFilterParameter(filterType, userId, agentId).pipe(
                    map(response =>
                        WorkBookActions.loadAdvanceFiltersSuccess({
                            filters: response
                        })
                    ),
                    catchError(error =>
                        of(WorkBookActions.loadAdvanceFiltersFailure({ error }))
                    )
                )
            )
        )
    );
}
