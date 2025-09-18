import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as LobActions from '../actions/lob-list.action';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { LOBService } from '@agenciiq/quotes';

@Injectable()
export class LobEffects {
    constructor(private actions$: Actions, private lobService: LOBService) { }

    loadLobList$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LobActions.loadLobList),
            switchMap(({ userId, savedLobList }) =>
                this.lobService.GetLOBList(userId).pipe(
                    map(lobList => {
                        if (lobList?.success && lobList.data?.lobsList) {
                            return LobActions.loadLobListSuccess({ lobList: lobList.data?.lobsList });
                        } else {
                            return LobActions.loadLobListFailure({ error: 'No LOBs found' });
                        }
                    }),
                    catchError(error => of(LobActions.loadLobListFailure({ error })))
                )
            )
        )
    );
}
