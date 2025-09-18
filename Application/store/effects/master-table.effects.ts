import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as ParameterActions from '../actions/master-table.action';

import { AQParameterService, ParameterKeysListService } from '@agenciiq/aqadmin';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { LoaderService } from 'src/app/shared/utility/loader/loader.service';

@Injectable()
export class ParameterEffects {
    constructor(
        private actions$: Actions,
        private keysService: ParameterKeysListService,
        private loader: LoaderService,
        private parameterService: AQParameterService,
    ) { }


    //get All parameter list  
    loadParameterKeys$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ParameterActions.loadParameterKeys),
            tap(() => this.loader.show()), // Optional: show loader
            switchMap(({ userId }) =>
                this.keysService.ParameterKeysList(userId).pipe(
                    map((response) => {
                        const parameterList = response?.data?.parameterList || [];
                        return ParameterActions.loadParameterKeysSuccess({ parameterList });
                    }),
                    catchError((error) => of(ParameterActions.loadParameterKeysFailure({ error })))
                )
            )
        )
    );

    // 👇 Optional effect to hide loader
    hideLoader$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(
                    ParameterActions.loadParameterKeysSuccess,
                    ParameterActions.loadParameterKeysFailure
                ),
                tap(() => this.loader.hide())
            ),
        { dispatch: false }
    );


    //get data by parameter ID
    loadParametersByKey$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ParameterActions.loadParametersByKey),
            switchMap(({ userId, parameterAlias }) =>
                this.parameterService.getAllParameterByKey(parameterAlias, userId).pipe(
                    map(response => {
                        const alias = parameterAlias || '';
                        const rawList = response?.data?.parameterList || [];

                        // Filter out null `parameterName` entries
                        const filteredList = rawList.filter(item => item.parameterName !== null);
                        const res = { details: { [alias]: filteredList } }
                        return ParameterActions.loadParametersByKeySuccess(res);
                    }),
                    catchError(error => of(ParameterActions.loadParametersByKeyFailure({ error })))
                )
            )
        )
    );
}
