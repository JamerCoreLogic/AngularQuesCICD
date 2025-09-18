import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { LoaderService } from 'src/app/shared/utility/loader/loader.service';
import { MAnageProgramService } from '@agenciiq/aq-programs';
import * as ProgramActions from '../actions/program.action';

@Injectable()
export class ProgramEffects {
    constructor(
        private actions$: Actions,
        private program: MAnageProgramService,
        private loader: LoaderService
    ) { }

    loadProgramList$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ProgramActions.loadProgramList),
            //tap(() => this.loader.show()), // Show loader like agency effect
            switchMap(({ userId, clientId }) =>
                this.program.ManagePrograms(userId, clientId).pipe(
                    map(response => {
                        const program = response;
                        return ProgramActions.loadProgramListSuccess({ programList: program as any });
                    }),
                    catchError(error => {
                        return of(ProgramActions.loadProgramListFailure({ error }));
                    })
                )
            )
        )
    );


    hideLoader$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(
                    ProgramActions.loadProgramListSuccess,
                    ProgramActions.loadProgramListFailure
                ),
                //tap(() => this.loader.hide())
            ),
        { dispatch: false }
    );
}
