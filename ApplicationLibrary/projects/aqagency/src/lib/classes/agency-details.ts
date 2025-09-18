import { IAgencyDetails } from '../interfaces/base-agency-list-resp';


export class AgencyDetailsResp implements IAgencyDetails {

    userId: number;
    agencyId: number;
    agencyName: string;
    contactPerson: string;
    phoneCell: string;
    phoneHome?: any;
    phoneOffice?: any;
    fax?: any;
    email: string;
    npn: string;
    npnExpirationDate: Date;
    addressLine1: string;
    addressLine2?: any;
    city: string;
    state: string;
    zip: string;
    isActive: boolean;
    createdBy?: any;
    createdOn: Date;
    modifiedBy?: any;
    modifiedOn?: any;
    registered: string;

    constructor(resp: IAgencyDetails) {
        this.userId = resp.userId;
        this.agencyId = resp.agencyId;
        this.agencyName = resp.agencyName;
        this.contactPerson = resp.contactPerson;
        this.phoneCell = resp.phoneCell;
        this.phoneHome = resp.phoneHome;
        this.phoneOffice = resp.phoneOffice;
        this.fax = resp.fax;
        this.email = resp.email;
        this.npn = resp.npn;
        this.npnExpirationDate = resp.npnExpirationDate;
        this.addressLine1 = resp.addressLine1;
        this.addressLine2 = resp.addressLine2;
        this.city = resp.city;
        this.state = resp.state;
        this.zip = resp.zip;
        this.isActive = resp.isActive;
        this.registered = resp.registered;
    }
}

// 

