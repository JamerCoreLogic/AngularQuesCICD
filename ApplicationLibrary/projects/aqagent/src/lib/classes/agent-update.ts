import { IAgent} from '../interfaces/base-agent-update-resp';

export class Agentupdate implements IAgent{

    agentId: string;
    userId: string;
    BranchId: string;
    agencyId: number;
    firstName: string;
    middleName: string;
    lastName: string;
    phoneCell: string;
    phoneHome: string;
    phoneOffice: string;
    fax: string;
    email: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    zip: string;
    isActive?: any;
    createdBy: number;
    createdOn?: any;
    modifiedBy: number;
    modifiedOn: Date;


constructor(resp :IAgent){

    this.agentId = resp.agentId;
    this.userId = resp.userId;
    this.BranchId = resp.BranchId;
    this.agencyId = resp.agencyId;
    this.firstName = resp.firstName;
    this.middleName = resp.middleName;
    this.lastName = resp.lastName
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
 


}


}