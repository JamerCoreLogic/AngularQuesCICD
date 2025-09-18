
export interface IAgencyProgramResp {
    data: IAgencyProgramData;
    success: boolean;
    message: string;
}

export interface IAgencyProgramData {
    agencyPrograms: IAgencyProgramList[];
}

export interface IAgencyProgramList {
    agencyId?: any;
    programId: number;
    programName: string;
    checked: boolean;
    isActive?: any;
}

