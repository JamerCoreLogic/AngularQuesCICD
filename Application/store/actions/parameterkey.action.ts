// state.actions.ts
import { createAction, props } from '@ngrx/store';

export const loadStates = createAction(
    '[State/API] Load States',
    props<{ parameterKey: string; userId: number; }>()
);

export const loadStatesSuccess = createAction(
    '[State/API] Load States Success',
    props<{ stateList: any }>()
);

export const loadStatesFailure = createAction(
    '[State/API] Load States Failure',
    props<{ error: any }>()
);
