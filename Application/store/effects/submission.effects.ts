import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { LoaderService } from 'src/app/shared/utility/loader/loader.service';
import * as MGAProgramActions from '../actions/submission.action';
import { AQFormsService } from '@agenciiq/aqforms';
import { ProgramService } from '@agenciiq/aqadmin';

@Injectable()
export class submissionEffects {
    constructor(
        private actions$: Actions,
        private programService: ProgramService,
        private loader: LoaderService
    ) { }

    loadMGAPrograms$ = createEffect(() =>
        this.actions$.pipe(
            ofType(MGAProgramActions.loadMGAPrograms),
            switchMap(({ userId }) =>
                this.programService.MGAPrograms(userId, 1).pipe(
                    map(response => {
                        const programList = response?.data?.mgaProgramList || [];
                        return MGAProgramActions.loadMGAProgramsSuccess({ programs: programList });
                    }),
                    catchError(error => of(MGAProgramActions.loadMGAProgramsFailure({ error })))
                )
            )
        )
    );
}