import { IBranchDetails } from '../interfaces/base-agency-list-resp';

export class BranchDetails implements IBranchDetails {

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
    modifiedOn?: Date;

    constructor(resp: IBranchDetails) {
        this.agencyId = resp.agencyId;
        this.branchId = resp.branchId;
        this.branchName = resp.branchName;
        this.city = resp.city;
        this.isActive = resp.isActive;
        this.state = resp.state;
        this.streetAddress1 = resp.streetAddress1;
        this.streetAddress2 = resp.streetAddress2;
        this.zip = resp.zip;
    }

}