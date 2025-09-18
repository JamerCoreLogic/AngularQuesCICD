import { createAction, props } from '@ngrx/store';

export const loadTodoList = createAction(
    '[Todo] Load Todo List',
    props<{ userId: number; agentId: number; agencyId: number; date: Date }>()
);

export const loadTodoListSuccess = createAction(
    '[Todo] Load Todo List Success',
    props<{ todoLists: any }>()
);

export const loadTodoListFailure = createAction(
    '[Todo] Load Todo List Failure',
    props<{ error: any }>()
);

