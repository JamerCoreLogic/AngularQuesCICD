import {IAgentDeleteResp} from '../interfaces/base-agent-delete-resp';
import {AgentDelete} from './agent-delete'

export class AgentDel implements IAgentDeleteResp{

    data: null;
    success: boolean;
    message: string;
    constructor(resp: IAgentDeleteResp) {
        this.message = resp.message;
        this.success = resp.success;
    
    }

   
}