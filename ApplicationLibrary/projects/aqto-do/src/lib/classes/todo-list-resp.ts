import { IToDoListResp, ITodoListData, ITodoListSummary, IToDoList } from '../interfaces/base-todo-list-resp';
import { TodoList } from './todo-list';

export class TodoListResp implements IToDoListResp {
    data: ITodoListData = {
        taskSummaries : [],
        toDoLists: []
    };
    success: boolean;
    message?: any;

    constructor(resp: IToDoListResp) {
        this.success = resp.success;
        this.message = resp.message;
        this.data.taskSummaries = resp.data.taskSummaries;
        this.data.toDoLists = this.filterTodoList(resp.data.toDoLists);
    }

    private filterTodoList(resp: IToDoList[]): IToDoList[] {
        if(resp){
            return resp.map((res: IToDoList) => {
                return new TodoList(res);
            });
        }
      
    }
}
