import { Injectable } from '@angular/core';
import { endpointService } from './endpoint-service';

@Injectable({
        providedIn:'root'
        
})
export class ToDoApi {

constructor(private api:endpointService)
{

}

// apiendPoint
//private _todoListApi = `{api.apiEndPoint}agencyqapi/api/Alert/ToDoList`;
//private _todoListApi = "http://makri.kmgus.com/agencyqapi/api/Alert/ToDoList";

get todoListApi(){
    return this.api.apiEndPoint+'/AQAPI/api/Users/MyDiary';
}
    
}