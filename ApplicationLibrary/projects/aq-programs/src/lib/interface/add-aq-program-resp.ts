export interface AQProgramAddRespons {
    programId: number;
    programName: string;
    carrierId: number;
    carrier: string;
    formData: string;
    isActive: boolean;
    formID:number;
    description: string;
    createdBy: string;
    createdOn: Date;
    modifiedOn: Date;
    modifiedBy: string;
    effectiveDate: Date;
    expirationDate:Date;
}



export interface AQProgramAddData {
    program: AQProgramAddRespons[];
}

export interface IAQProgramAddResp {
    data: AQProgramAddData;
    success: boolean;
    message: string;
}