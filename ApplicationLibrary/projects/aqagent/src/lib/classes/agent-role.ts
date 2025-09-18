import  { IAgentRole} from  "../interfaces/base-agent-list-resp";


export class Agentrole implements IAgentRole{


    roleId: number;
    roleCode: string;
    roleName: string;

constructor (resp:IAgentRole)
{
 
    this.roleId = resp.roleId;
    this.roleCode = resp.roleCode;
    this.roleName = resp.roleName;

}
}