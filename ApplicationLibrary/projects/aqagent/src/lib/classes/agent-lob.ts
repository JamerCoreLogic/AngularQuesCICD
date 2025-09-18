import  { IUnderwriterLob} from  "../interfaces/base-agent-list-resp";


export class UnderwriterLob implements IUnderwriterLob{


    lobId: number;
    // roleCode: string;
    // roleName: string;

constructor (resp:IUnderwriterLob)
{
 
    this.lobId = resp.lobId;
    // this.roleCode = resp.roleCode;
    // this.roleName = resp.roleName;

}
}