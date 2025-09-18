export interface AQProgramByIdRespons {
    programId: number;
    programName: string;
    carrierId: number;
    carrier: string;
    formData: string;
    isActive: boolean;
    description: string;
    createdBy: string;
    createdOn: Date;
    modifiedOn: Date;
    modifiedBy: string;
    effectiveDate: Date;
    expirationDate:Date;

    formID: number;
    
}



export interface AQProgramByIdData {
    program: AQProgramByIdRespons;   
    programsDefinition: ProgramsDefinition;
}

export interface IAQProgramByIdResp {
    data: AQProgramByIdData;
    success: boolean;
    message: string;
}




export interface ProgramsDefinition {
    formId: number;
    programDefinition: string;
    effectiveFrom: Date;
    effectiveTo?: any;
    isActive: boolean;
}
