
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { LoaderService } from 'src/app/shared/utility/loader/loader.service';
import * as mgaConfigActions from '../actions/mga-config.action';
import { MgaConfigService } from '@agenciiq/mga-config';
import { LOBService } from '@agenciiq/quotes';

@Injectable()
export class MgaConfigEffects {
    constructor(
        private actions$: Actions,
        private mgaService: MgaConfigService,
        private loader: LoaderService
        , private _lobService: LOBService
    ) { }

    loadMGADetails$ = createEffect(() =>
        this.actions$.pipe(
            ofType(mgaConfigActions.loadMGADetails),
            switchMap(({ userId }) =>
                this.mgaService.MGADetails(userId).pipe(
                    map((response) => {
                        if (response && response?.data) {
                            return mgaConfigActions.loadMGADetailsSuccess({ data: response.data });
                        } else {
                            return mgaConfigActions.loadMGADetailsFailure({ error: 'No data found' });
                        }
                    }),
                    catchError((error) => of(mgaConfigActions.loadMGADetailsFailure({ error })))
                )
            )
        )
    );

}