import { IAgent, IAgentBranch, IAgentRole } from '../interfaces/base-agent-list-resp';

export class AgentList implements IAgent {

    agentId: number;
    userId: number;
    branchId?: any;
    supervisorId?: any;
    supervisorname?: any;
    managerId?: number;
    managerName: string;
    agencyId: number;
    agencyName: string;
    firstName: string;
    middleName: string;
    lastName: string;
    phoneCell: string;
    phoneHome?: any;
    phoneOffice?: any;
    fax?: any;
    email: string;
    addressLine1: string;
    addressLine2?: any;
    city: string;
    state: string;
    zip: string;
    isActive: boolean;
    createdBy?: any;
    createdOn: Date;
    modifiedBy?: number;
    modifiedOn?: Date;
    isLocked:any;

    constructor(resp: IAgent) {
        this.agentId = resp.agentId;
        this.userId = resp.userId;
        this.branchId = resp.branchId;
        this.supervisorId = resp.supervisorId;
        this.supervisorname = resp.supervisorname;
        this.managerId = resp.supervisorname;
        this.managerName = resp.managerName;
        this.agencyId = resp.agencyId;
        this.agencyName = resp.agencyName;
        this.firstName = resp.firstName;
        this.middleName = resp.middleName;
        this.lastName = resp.lastName;
        this.phoneCell = resp.phoneCell;
        this.phoneHome = resp.phoneHome;
        this.phoneOffice = resp.phoneOffice;
        this.fax = resp.fax;
        this.email = resp.email;
        this.addressLine1 = resp.addressLine1;
        this.addressLine2 = resp.addressLine2;
        this.city = resp.city;
        this.state = resp.state;
        this.zip = resp.zip;
        this.isActive = resp.isActive;
        this.isLocked = resp.isLocked;
    }
}


