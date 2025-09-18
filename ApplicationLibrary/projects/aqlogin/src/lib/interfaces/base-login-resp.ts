export interface ILoginResp {
    data: IData,
    success: boolean,
    message: string
}

export interface IData {
    user: IUser;
    agent: IAgent;
    agency: IAgency;
    role: IRole[];
    roleRight: IRoleRight[];
}

export interface IUser {
    userId: number;
    userName: string;
    newUser: boolean;
    resetPassword: boolean;
    isLocked:boolean;
    token:string;
    refreshToken:string;
}

export interface IAgent {
    agentId: number;
    userId: number;
    agencyId: number;
    firstName: string;
    middleName?: any;
    lastName: string;
    phoneCell?: any;
    phoneHome?: any;
    phoneOffice?: any;
    fax?: any;
    email: string;
    addressLine1?: any;
    addressLine2?: any;
    city: string;
    state: string;
    zip: string;
    isActive: boolean;
    createdBy?: any;
    createdOn?: any;
    modifiedBy: number;
    modifiedOn: Date;
    branchId?: any;
    supervisorId: number;
    supervisorname?: any;
    managerId: number;
    managerName?: any;
    agencyName?: any;
}

export interface IAgency {
    userId: number;
    agencyId: number;
    agencyName: string;
    contactPerson: string;
    phoneCell: string;
    phoneHome?: any;
    phoneOffice?: any;
    fax?: any;
    email?: any;
    npn?: any;
    npnExpirationDate?: any;
    addressLine1?: any;
    addressLine2?: any;
    city?: any;
    state?: any;
    zip?: any;
    isActive: boolean;
    createdBy: number;
    createdOn?: any;
    modifiedBy?: any;
    modifiedOn?: any;   
    managerId: number;
    manager?: any;
    supervisorId: number;
    supervisor?: any;   
    agentName?: any;   
}

export interface IRole {
    roleId: number;
    roleCode: string;
    roleName: string;
}

export interface IRoleRight {
    roles: number[];
    screenId: number;
    screenName: string;
    description: string;
    routing?: any;
    rights: IRight[];
}

export interface IRight {
    rightId: number;
    rightName: string;
}
