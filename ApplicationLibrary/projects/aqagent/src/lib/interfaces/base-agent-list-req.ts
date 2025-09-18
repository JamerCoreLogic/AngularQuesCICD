export interface IAgentlistReq {
    UserId: number;
    AgencyId?: number;
    ManagerId?: number;
    SupervisorId?: number;
    IsActive?: boolean;
    AgencyName?: string;
    ManagerName?: string;
    SupervisorName?: string;
}

