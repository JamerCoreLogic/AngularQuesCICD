import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { LoaderService } from 'src/app/shared/utility/loader/loader.service';
import * as ManageActionActions from '../actions/manage.account.actions';
import { AQZipDetailsService } from '@agenciiq/aqadmin';

@Injectable()
export class ManageAccountEffects {
    constructor(
        private actions$: Actions,
        private zipDetails: AQZipDetailsService,
        private loader: LoaderService
    ) { }

    loadAccountDetails$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ManageActionActions.loadAccountDetails),
            tap(() => this.loader.show()),
            switchMap(({Address1, Address2,City , State, Zip5, Zip4 }) =>
             this.zipDetails.ValidateAddressField(Zip4,Zip5,City , State, Address1 ,Address2).pipe(
                    map(response => {
                        const data = response;
                        return ManageActionActions.loadAccountDetailsSuccess({ accountDetails: data as any });
                    }),
                    catchError(error => {
                        return of(ManageActionActions.loadAccountDetailsFailure({ error }));
                    })
                )
            )
        )
    );


    hideLoader$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(
                  ManageActionActions.loadAccountDetailsSuccess,
                  ManageActionActions.loadAccountDetailsFailure
                ),
                tap(() => this.loader.hide())
            ),
        { dispatch: false }
    );
}
