import { IAgentRolesResp,IRole}  from '../interfaces/base-agent-roles-resp';


export  class AgentRoles implements IRole{
    roleID: number;
    roleCode: string;
    roleName: string;


constructor(resp: IRole){

   this.roleID = resp.roleID
    this.roleCode = resp.roleCode;
    this.roleName =  resp.roleName

}






}