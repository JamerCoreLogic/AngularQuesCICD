import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TodoState } from '../reducers/myDiary.reducer';

export const selectTodoState = createFeatureSelector<TodoState>('todo');

export const selectTodoLists = createSelector(
    selectTodoState,
    state => state.todoLists
);

// export const selectTodoSummary = createSelector(
//     selectTodoState,
//     state => state.todoSummary
// );

export const selectTodoLoading = createSelector(
    selectTodoState,
    state => state.loading
);
