import { createReducer, on } from '@ngrx/store';
import * as TodoActions from '../actions/myDiary.action';

export interface TodoState {
    todoLists: any[];
    //todoSummary: any[];
    loading: boolean;
    error: any;
}

export const initialState: TodoState = {
    todoLists: [],
    //todoSummary: [],
    loading: false,
    error: null,
};

export const todoReducer = createReducer(
    initialState,
    on(TodoActions.loadTodoList, state => ({
        ...state,
        loading: true,
        error: null
    })),
    on(TodoActions.loadTodoListSuccess, (state, { todoLists }) => ({
        ...state,
        todoLists,
        loading: false
    })),
    on(TodoActions.loadTodoListFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error
    }))
);
