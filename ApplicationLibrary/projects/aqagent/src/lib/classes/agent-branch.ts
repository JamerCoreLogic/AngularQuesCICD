import { IAgentBranch} from "../interfaces/base-agent-list-resp"

export class  AgentBranch implements  IAgentBranch {
    branchId: number;
    branchName: string;
    agencyId: string;
    streetAddress1?: any;
    streetAddress2?: any;
    city?: any;
    state?: any;
    zip?: any;
    isActive: boolean;
    createdBy: string;
    createdOn: Date;
    modifiedBy: string;
    modifiedOn: Date;

    constructor(resp:IAgentBranch){
       this.branchId = resp.branchId;
        this.branchName = resp.branchName;
        this.agencyId = resp.agencyId;
        this.streetAddress1 = resp.streetAddress1;
        this.streetAddress2 = resp.streetAddress2;
        this.city = resp.city;
        this.state = resp.state;
        this.zip = resp.zip;
        this.isActive = resp.isActive;
     

    }


}