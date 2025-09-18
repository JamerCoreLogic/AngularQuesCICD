export interface IAgent {
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
}

export interface IUpdateUserRole {
    userRoleId: number;
    userId: number;
    roleId: number;
    isActive?: any;
    createdBy?: any;
    createdOn?: any;
    modifiedBy: number;
    modifiedOn: Date;
}

export interface IData {
    user?: any;
    agent: IAgent[];
    userRoles: IUpdateUserRole[];
    branches?: any;
}

export interface IAgentUpdateResp {
    data: IData;
    success: boolean;
    message: string;
}