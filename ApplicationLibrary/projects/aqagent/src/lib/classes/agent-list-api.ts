import { Injectable } from "@angular/core";


@Injectable({
    providedIn: 'root'
})
export class AgentListApi {
    private agentListApi = '/AQAPI/api/Agents/GetAgentsList';
    private agentAddApi = '/AQAPI/api/Agents/SaveAgent';
    private agentdeleteApi = '/AQAPI/api/Agents/DeleteAgent';
    private agentgetrolesApi= '/AQAPI/api/Users/GetRoleDetails';
   
    constructor(){

    }

    get AgentListApi(){
        return this.agentListApi;
    }

    get AgentAdd(){
         return this.agentAddApi;
    }

    get AgentDelete(){
        return this.agentdeleteApi;
    }

get agentRole(){
return this.agentgetrolesApi;

}

    set AgentListApiEndPoint(value){
        this.agentListApi = value + this.agentListApi;
        this.agentAddApi = value + this.agentAddApi;
        this.agentdeleteApi= value + this.agentdeleteApi;
        this.agentgetrolesApi=value + this.agentgetrolesApi;
    }
}