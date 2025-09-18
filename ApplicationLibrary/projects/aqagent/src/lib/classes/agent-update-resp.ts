import { IAgent , IAgentUpdateResp,IData,IUpdateUserRole} from '../interfaces/base-agent-update-resp';
import {Agentupdate} from './agent-update';

export class Agentupdte implements IAgentUpdateResp {

    data: null;
    success: boolean;
    message: string;

    constructor(resp: IAgentUpdateResp) {
        this.message = resp.message;
        this.success = resp.success;
    }

 

}