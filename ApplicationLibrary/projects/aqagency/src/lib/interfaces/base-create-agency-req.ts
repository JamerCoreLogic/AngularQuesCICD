export interface ICreateAgencyReq {
    UserId?: string;
    AgencyId?: string;
    AgencyName?: string;
    ContactPerson?: string;
    PhoneCell?: string;
    PhoneHome?: string;
    PhoneOffice?: string;
    Fax?: string;
    Email?: string;
    NPN?: string;
    registered:boolean;
    NPNExpirationDate?: string;
    AddressLine1?: string;
    AddressLine2?: string;
    City?: string;
    State?: string;
    Zip?: string;
    IsActive?: string;
    branches: IAgencyBranch[];
    AgencyPrograms: IAgencyProgram[];
}

export interface IAgencyBranch {
    branchId?: number;
    branchName?: string;
    agencyId?: string;
    streetAddress1?: any;
    streetAddress2?: any;
    city?: any;
    state?: any;
    zip?: any;
}

export interface IAgencyProgram {
    programId: number;
    programName: string;
    checked: boolean;
    isActive?: any;
}
