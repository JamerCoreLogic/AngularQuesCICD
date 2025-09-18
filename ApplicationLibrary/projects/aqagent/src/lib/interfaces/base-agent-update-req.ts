export interface IAgentRole {
    UserRoleId?: number;
    userId?: number;
    roleId?: number;
}

export interface  IAgentUpdateReq {
    AgencyId?: string;
    UserId?: number;
    UserName?: string;
    FirstName?: string;
    Middlename?: string;
    LastName?: string;
    Email?: string;
    Zip?: string;
    City?: string;
    State?: string;
    AddressLine1?: string;
    AddressLine2?: string;
    PhoneCell?: string;
    PhoneOffice?: string;
    PhoneHome?: string;
    AgentId?: string;
    BranchId?: string;
    SupervisorId?: number;
    ManagerId?: number;
    userRoles: IAgentRole[];
}