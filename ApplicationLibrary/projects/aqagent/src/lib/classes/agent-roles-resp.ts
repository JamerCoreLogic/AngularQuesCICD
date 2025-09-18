import { IData,IRole,IAgentRolesResp} from '../interfaces/base-agent-roles-resp';
import {AgentRoles } from './agent-roles';

export class AgentRol implements IAgentRolesResp{

data:IData = {
    role :[]
};
success: boolean;
message?: any;

constructor(resp:IAgentRolesResp){

    this.message= resp.message;
    this.success = resp.success;
    this.data.role = resp.data.role
}

}