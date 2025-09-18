
    export interface IAgent {
        agentId: number;
        userId: number;
        branchId?: any;
        supervisorId?: any;
        supervisorname?: any;
        managerId?: number;
        managerName: string;
        agencyId: number;
        agencyName: string;
        firstName: string;
        middleName: string;
        lastName: string;
        phoneCell: string;
        phoneHome?: any;
        phoneOffice?: any;
        fax?: any;
        isLocked:any,
        email: string;
        addressLine1: string;
        addressLine2?: any;
        city: string;
        state: string;
        zip: string;
        isActive: boolean;
        createdBy?: any;
        createdOn: Date;
        modifiedBy?: number;
        modifiedOn?: Date;
    }

    export interface IAgentRole {
        roleId: number;
        roleCode: string;
        roleName: string;
    }

    export interface IAgentBranch {
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
        modifiedOn: Date;
    }

    export interface IUnderwriterLob{
        //underwriterLobId: number,
        lobId: number,
        // createdOn: Date,
        // createdBy: number,
        // modifiedOn: Date,
        // modifiedBy: number
        // underwriterId: number,
    }

    export interface IUnderwriterState{
        underwriterStateId: number,
        stateId: number,
        createdOn: Date,
        createdBy: number,
        modifiedOn: Date,
        modifiedBy: number,
        underwriterId: number,
    }

    export interface IUnderwriterAssistant{
        id: number,
        underwriterAssistantId: number,
        underwriterId: number,
    }

    export interface IAgentList {
        agent: IAgent;
        agentRoles: IAgentRole[];
        agentBranch:IAgentBranch[];
        underwriterLob:IUnderwriterLob[];
        underwriterState:IUnderwriterState[];
        underwriterAssistant:IUnderwriterAssistant[];
    }

     
    export interface IAgentData {
        agentList: IAgentList[];
    }

    export interface IAgentListResp {
        data: IAgentData;
        success: boolean;
        message?: any;
    }


