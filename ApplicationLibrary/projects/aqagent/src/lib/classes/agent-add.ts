import {IAgentAdd} from "../interfaces/base-agent-add-resp";


export class AgentAdd implements IAgentAdd{
   
    agentId: number;
    userId: number;
    branchId?: any;
    supervisorId: number;
    supervisorname?: any;
    managerId: number;
    managerName?: any;
    agencyId: number;
    agencyName?: any;
    firstName: string;
    middleName: string;
    lastName: string;
    phoneCell: string;
    phoneHome: string;
    phoneOffice: string;
    fax?: any;
    email: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    zip: string;
    isActive: boolean;
    createdBy: number;
    createdOn: Date;
    modifiedBy: number;
    modifiedOn: Date;
    constructor(resp: IAgentAdd){
       
        this.agentId = resp.agentId;
        this.userId = resp.userId;
        this.branchId = resp.branchId;
        this.supervisorId = resp.supervisorId;
        this.supervisorname = resp.supervisorname;
        this.managerId = resp.managerId;
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
        this.createdBy = resp.createdBy;
        this.createdOn = resp.createdOn;
        this.modifiedBy = resp.modifiedBy;
        this.modifiedOn = resp.modifiedOn;
    }

}