export interface IAdvanceFilterAgent {
    agentId?: number;
    firstName?:string;
    middleName?:string;
    lastName?:string;
}

export interface IAdvanceFilterAgentData {
    agentsList: IAdvanceFilterAgent[];
}

export interface IAdvanceFilterAgentResp {
    data: IAdvanceFilterAgentData;
    success: boolean;
    message?: any;
}