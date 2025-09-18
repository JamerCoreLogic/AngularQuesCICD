import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AQAgencyService } from '@agenciiq/agency';
import * as AgencyActions from '../actions/agency.actions';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { LoaderService } from 'src/app/shared/utility/loader/loader.service';

@Injectable()
export class AgencyEffects {
  constructor(
    private actions$: Actions,
    private agencyService: AQAgencyService,
    private loader: LoaderService
  ) { }

  loadAgencyList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AgencyActions.loadAgencyList),
      tap(() => this.loader.show()), // Show loader
      switchMap(({ userId, agencyId, agentId, registerType }) =>
        this.agencyService.NewAgencyList(userId, agencyId, agentId).pipe(
          map(response => {
            // const list = response?.data?.agencyList ?? [];
            const list = response;
            return AgencyActions.loadAgencyListSuccess({ agencyList: list, registerType });
          }),
          catchError(error => of(AgencyActions.loadAgencyListFailure({ error })))
        )
      )
    )
  );

  hideLoader$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          AgencyActions.loadAgencyListSuccess,
          AgencyActions.loadAgencyListFailure
        ),
        tap(() => this.loader.hide())
      ),
    { dispatch: false }
  );
}

