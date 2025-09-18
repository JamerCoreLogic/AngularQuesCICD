import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as ProgramActions from '../actions/mgaProgram.action';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ProgramService } from '@agenciiq/aqadmin';

@Injectable()
export class MgaProgramEffects {
    constructor(private actions$: Actions, private programService: ProgramService) { }

    loadMGAPrograms$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ProgramActions.loadMGAPrograms),
            switchMap(({ userId, agencyId }) =>
                this.programService.MGAPrograms(userId, agencyId).pipe(
                    map(response =>
                        ProgramActions.loadMGAProgramsSuccess({
                            programs: response
                        })
                    ),
                    catchError(error =>
                        of(ProgramActions.loadMGAProgramsFailure({ error }))
                    )
                )
            )
        )
    );
}
