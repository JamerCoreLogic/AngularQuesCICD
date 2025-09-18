// state.effects.ts
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { loadStates, loadStatesSuccess, loadStatesFailure } from '../actions/parameterkey.action';
import * as ParameterActions from '../actions/parameterkey.action';
import { AQParameterService } from '@agenciiq/aqadmin';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class StateEffects {
    constructor(private actions$: Actions, private aqParameterService: AQParameterService) { }

    //   loadStates$ = createEffect(() =>
    //     this.actions$.pipe(
    //       ofType(loadStates),
    //       switchmap(({ parameterKey, userId, data }) =>
    //         this.aqParameterService.getParameterByKey(parameterKey, userId).pipe(
    //           map(stateList => {
    //             if (stateList?.success && stateList.data?.parameterList) {
    //               return loadStatesSuccess({ stateList: lobListWithStates, data });
    //             } else {
    //               return loadStatesFailure({ error: 'No data found' });
    //             }
    //           }),
    //           catchError(error => of(loadStatesFailure({ error })))
    //         )
    //       )
    //     )
    //   );

    loadStates$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ParameterActions.loadStates),
            switchMap(({ parameterKey, userId }) =>
                this.aqParameterService.getParameterByKey(parameterKey, userId).pipe(
                    map(stateList => {
                        if (stateList?.success) {
                            return ParameterActions.loadStatesSuccess({ stateList: stateList });
                        } else {
                            return ParameterActions.loadStatesFailure({ error: 'No State found' });
                        }
                    }),
                    catchError(error => of(ParameterActions.loadStatesFailure({ error })))
                )
            )
        )
    );
}
