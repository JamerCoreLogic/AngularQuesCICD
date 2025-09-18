import { IAgentAddResp, IAgentData, IUserRole, IAgentAddList, IAgentAdd } from '../interfaces/base-agent-add-resp';




export class AgentAd implements IAgentAddResp {
    data: null;
    success: boolean;
    message: string;

    constructor(resp: IAgentAddResp) {
        this.message = resp.message;
        this.success = resp.success;        
    }
   
}