export interface IAgencyListResp {
    data: IAgencyListData;
    success: boolean;
    message?: any;
}

export interface IAgencyList {
    agency: IAgencyDetails;
    branches: IBranchDetails[];
    agencyPrograms: IAgencyProgram[];
}

export interface IAgencyListData {
    agencyList: IAgencyList[];
}

export interface IAgencyDetails {
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
}

export interface IBranchDetails {
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
}

export interface IAgencyProgram {
    agencyId: number;
    programId: number;
    programName: string;
    checked: boolean;
    isActive?: boolean;
}


