import { IAdvanceFilterAgentResp, IAdvanceFilterAgentData } from '../interfaces/advance-filter-agent-resp';

export class AdvanceFilterAgentResp implements IAdvanceFilterAgentResp {
    data: IAdvanceFilterAgentData = {
        agentsList: []
    };
    message;
    success;

    constructor(resp: IAdvanceFilterAgentResp) {
        this.message = resp.message;
        this.success = resp.success;
        this.data.agentsList = resp.data.agentsList;
    }

    
}