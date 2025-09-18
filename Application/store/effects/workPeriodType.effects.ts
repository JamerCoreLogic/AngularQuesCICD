import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as WorkboardActions from '../actions/workPeriodType.actions';
import { AqworkboardServiceService } from '@agenciiq/aqworkboard';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class WorkboardPeriodEffects {
    constructor(private actions$: Actions, private workboardService: AqworkboardServiceService) { }
    loadPeriodTypes$ = createEffect(() =>
        this.actions$.pipe(
            ofType(WorkboardActions.loadPeriodTypes),
            switchMap(() =>
                this.workboardService.workboardPeriodList().pipe(
                    map((data) => {
                        if (data?.data?.workboardResponse) {
                            return WorkboardActions.loadPeriodTypesSuccess({
                                workboardResponse: data as any
                            });
                        } else {
                            return WorkboardActions.loadPeriodTypesFailure({ error: 'No data found' });
                        }
                    }),
                    catchError(error =>
                        of(WorkboardActions.loadPeriodTypesFailure({ error })) // already an Action
                    )
                )
            )
        )
    );

}
