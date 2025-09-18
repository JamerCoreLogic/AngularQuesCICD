import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {ToDoApi} from '../../classes/todo-api';
import {TodoListResp} from '../../classes/todo-list-resp';
import {IToDoListResp} from '../../interfaces/base-todo-list-resp';
import {IToDoListReq} from '../../interfaces/base-todo-list-req';
import { map, catchError, retry } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class TodoListService {

  constructor(
    private _http:HttpClient,
    private _api:ToDoApi
  ) { }

  todo_list(UserId: number, AgentId: number, AgencyId: number, CurrentDate?: any):Observable<IToDoListResp>{
    let reqObj:IToDoListReq ={
        UserId : UserId,
        AgentId : AgentId,
        AgencyId : AgencyId,
        CurrentDate : CurrentDate
    }
   return this._http.post<IToDoListResp>(this._api.todoListApi, reqObj)
    .pipe(
      map((resp:IToDoListResp)=>{
        if(resp && resp.data){
          return new TodoListResp(resp);
        }
      })
    )

  }
}
