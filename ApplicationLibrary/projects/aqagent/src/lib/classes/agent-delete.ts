import { IAgentDeleteResp} from  '../interfaces/base-agent-delete-resp';

export class AgentDelete implements IAgentDeleteResp{


    data?: any;
    success: boolean;
    message: string;
 constructor(resp:IAgentDeleteResp){

    this.data = resp.data;
    this.success = resp.success;
    this.message = resp.message;
 }

 

}