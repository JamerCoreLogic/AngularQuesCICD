import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as TodoActions from '../actions/myDiary.action';
import { TodoListService } from '@agenciiq/aqtodo';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class TodoEffects {
    constructor(
        private actions$: Actions,
        private todoListService: TodoListService
    ) { }

    loadTodoList$ = createEffect(() =>
        this.actions$.pipe(
            ofType(TodoActions.loadTodoList),
            switchMap(action =>
                this.todoListService.todo_list(
                    action.userId,
                    action.agentId,
                    action.agencyId,
                    action.date
                ).pipe(
                    map(data => {
                        if (data?.data?.toDoLists) {
                            return TodoActions.loadTodoListSuccess({ todoLists: data });
                        } else {
                            return TodoActions.loadTodoListFailure({ error: 'No records found' });
                        }
                    }),
                    catchError(error => of(TodoActions.loadTodoListFailure({ error })))
                )
            )
        )
    );



}
