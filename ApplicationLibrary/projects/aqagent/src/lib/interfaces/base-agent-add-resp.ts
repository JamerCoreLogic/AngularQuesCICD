
export interface IAgentAdd {
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
    isLocked:any;
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
}

export interface IUserRole {
    userRoleId: number;
    userId: number;
    roleId: number;
    isActive: boolean;
    createdBy: number;
    createdOn: Date;
    modifiedBy?: any;
    modifiedOn?: any;
}

export interface IAgentAddList{

    agentAdd: IAgentAdd[];
}

 export interface IAgentData {
   user?: any;    
   agent: IAgentAddResp;
    userRoles: IUserRole[];
     branches?: any;
    
 }

export interface IAgentAddResp {
    data:IAgentAddList;
    success: boolean;
    message: string;
}
