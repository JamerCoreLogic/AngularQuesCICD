import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as FormsActions from '../actions/other-screen.action';
import { LoaderService } from 'src/app/shared/utility/loader/loader.service';

import { AQFormsService } from '@agenciiq/aqforms';
import { AQParameterService } from '@agenciiq/aqadmin';

@Injectable()
export class OtherScrenEffects {
    constructor(
        private actions$: Actions,
        private formsService: AQFormsService,
        private loader: LoaderService,
        private parameterService: AQParameterService
    ) { }

    loadFormsList$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FormsActions.loadFormsList),
            switchMap(({ request }) =>
                this.formsService.GetFormsList(request).pipe(
                    map((response: any) => {
                        const fullList = response?.data?.aQFormResponses || [];
                        return FormsActions.loadFormsListSuccess({ forms: fullList }); // ✅ Store full list
                    }),
                    catchError(error => of(FormsActions.loadFormsListFailure({ error })))
                )
            )
        )
    );

    //     // Effect to load form types (parameters)
    loadFormTypes$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FormsActions.loadFormTypes),
            switchMap(({ userId }) =>
                this.parameterService.getParameterByKey('FORM TYPE', userId).pipe(
                    map(resp => {
                        const formTypes = resp;
                        return FormsActions.loadFormTypesSuccess({ formTypes });
                    }),
                    catchError(error => of(FormsActions.loadFormTypesFailure({ error })))
                )
            )
        )
    );
}