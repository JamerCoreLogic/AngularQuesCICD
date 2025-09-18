// kpi.effects.ts
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { catchError, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import * as AgentDashboardActions from '../actions/agent-dashboard.action';
import { KpiService } from '@agenciiq/aqkpi';
import { CheckRoleService } from 'src/app/shared/services/check-role/check-role.service';
import { MgaConfigService } from '@agenciiq/mga-config';

@Injectable()
export class KpiEffects {
    constructor(
        private actions$: Actions,
        private _apki: KpiService,
        private checkRoleService: CheckRoleService,
        private mgaConfigService: MgaConfigService,
    ) { }

    loadKpi$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AgentDashboardActions.loadKpi),
            switchMap(({ userId, period, startDate, endDate, agentId }) =>
                this._apki.AqkpiList(userId, period, startDate, endDate, 0, agentId, "").pipe(
                    map((response) => {
                        if (response?.data?.kpiResponses) {
                            // push notifier like you did before
                            this.checkRoleService.dashboardNotifier$.next({
                                data: JSON.stringify(response),
                                status: 'DataUpdated'
                            });
                        }
                        return AgentDashboardActions.loadKpiSuccess({ response: response });
                    }),
                    catchError((error) => of(AgentDashboardActions.loadKpiFailure({ error })))
                )
            )
        )
    );

    //for MGA Config
    loadMGAConfig$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AgentDashboardActions.loadMGAConfig),
            switchMap(({ userId }) =>
                this.mgaConfigService.MGADetails(userId).pipe(
                    map(response => {
                        const config = response?.data;

                        return AgentDashboardActions.loadMGAConfigSuccess({ config });
                    }),
                    catchError(error => of(AgentDashboardActions.loadMGAConfigFailure({ error })))
                )
            )
        )
    );
}
