
export interface ICreateAgencyData {
    user?: any;
    agency: ICreateAgency;
}

export interface ICreateAgencyResp {
    data: ICreateAgencyData;
    success: boolean;
    message: string;
}

export interface ICreateAgency {
    userId: number;
    agencyId: number;
    agencyName: string;
    contactPerson: string;
    phoneCell: string;
    phoneHome: string;
    phoneOffice: string;
    fax: string;
    email: string;
    npn: string;
    npnExpirationDate: Date;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    zip: string;
    isActive: boolean;
    createdBy: number;
    createdOn: Date;
    modifiedBy?: any;
    modifiedOn?: any;
}

