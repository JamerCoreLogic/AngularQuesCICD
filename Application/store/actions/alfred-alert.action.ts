
import { createAction, props } from '@ngrx/store';

export const loadAlfredAlerts = createAction(
    '[Alfred] Load Alfred Alerts',
    props<{ userId: number; agentId: number; }>()
);

export const loadAlfredAlertsSuccess = createAction(
    '[Alfred] Load Alfred Alerts Success',
    props<{ alerts: any[] }>()
);

export const loadAlfredAlertsFailure = createAction(
    '[Alfred] Load Alfred Alerts Failure',
    props<{ error: any }>()
);
