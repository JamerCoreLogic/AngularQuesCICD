import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import * as AlfredActions from '../actions/alfred-alert.action';
import { AQAlfredAlertsService } from '@agenciiq/aqalfred';

@Injectable()
export class AlfredEffects {
    constructor(
        private actions$: Actions,
        private alfredService: AQAlfredAlertsService,
    ) { }

    loadAlfredAlerts$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AlfredActions.loadAlfredAlerts),
            switchMap(({ userId, agentId, type }) =>
                this.alfredService.AlfredAlerrts(userId, agentId, 0).pipe(
                    map((res: any) =>
                        AlfredActions.loadAlfredAlertsSuccess({
                            alerts: res
                        })
                    ),
                    catchError((error) =>
                        of(AlfredActions.loadAlfredAlertsFailure({ error }))
                    )
                )
            )
        )
    );
}
