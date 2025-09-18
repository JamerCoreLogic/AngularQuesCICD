import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { catchError, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import * as InsuredProspectsActions from '../actions/insured.actions';
import { InsuredsProspectsService } from '@agenciiq/quotes';
@Injectable()
export class InsuredEffects {
    constructor(
        private actions$: Actions,
        private _insuredsProspects: InsuredsProspectsService
    ) { }

    loadKpi$ = createEffect(() =>
        this.actions$.pipe(
            ofType(InsuredProspectsActions.loadInsuredProspects),
            switchMap(({ userId, clientId }) =>
                this._insuredsProspects.getInsuredsProspects(userId, clientId).pipe(
                    map((response: any) =>
                        InsuredProspectsActions.loadInsuredProspectsSuccess({
                            data: response?.data?.insureds ?? []
                        })
                    ),
                    catchError((error) => of(InsuredProspectsActions.loadInsuredProspectsFailure({ error })))
                )
            )
        )
    );
}