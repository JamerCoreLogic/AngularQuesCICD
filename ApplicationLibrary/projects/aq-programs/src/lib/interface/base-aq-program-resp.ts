export interface AQProgramRespons {
    formId: number;
    programDefinition: string;
    // effectiveFrom: Date;
    // effectiveTo: Date;
    isActive: boolean;
}

export interface AQProgramData {
    aQProgramsForms: AQProgramRespons[];
}

export interface IAQProgramResp {
    data: AQProgramData;
    success: boolean;
    message: string;
}