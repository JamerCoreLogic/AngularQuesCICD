
    export interface IRole {
        roleID: number;
        roleCode: string;
        roleName: string;
    }

    export interface IData {
        role: IRole[];
    }

    export interface IAgentRolesResp {
        data: IData;
        success: boolean;
        message?: any;
    }
