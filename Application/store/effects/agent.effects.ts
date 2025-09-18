import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
//import { AgentService } from '../services/agent.service';

import { catchError, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { AQAgentListService } from '@agenciiq/aqagent';
import { LoaderService } from 'src/app/shared/utility/loader/loader.service';
import * as AgentActions from '../actions/agent.actions';

@Injectable()
export class AgentEffects {
    constructor(
        private actions$: Actions,
        private agent: AQAgentListService,
        private loader: LoaderService
    ) { }

    loadAgentList$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AgentActions.loadAgentList),
            tap(() => this.loader.show()), // Show loader like agency effect
            switchMap(({ userId, agencyId, agencyName, managerName, supervisorName, isActive }) =>
                this.agent.AgentList(userId, agencyId, agencyName, managerName, supervisorName, isActive).pipe(
                    map(response => {
                        const agents = response?.data?.agentList?.map(item => item.agent) || [];
                        return AgentActions.loadAgentListSuccess({ agentList: agents as any });
                    }),
                    catchError(error => {
                        return of(AgentActions.loadAgentListFailure({ error }));
                    })
                )
            )
        )
    );


    hideLoader$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(
                    AgentActions.loadAgentListSuccess,
                    AgentActions.loadAgentListFailure
                ),
                tap(() => this.loader.hide())
            ),
        { dispatch: false }
    );



}
