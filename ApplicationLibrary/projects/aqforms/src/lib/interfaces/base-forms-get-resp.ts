export interface IFormGetResponse {
    data: AQFormGetResponse;
    success: boolean;
    message: string
}

export interface AQFormGetResponse {
    aQFormResponses: AQFormGetData[]
}


export interface AQFormGetData {
    formId: number;
    formDefinition: string;
    lobCode: string;
    lobId:number;
    formType: string;
    formTypeId:number;
    stateCode: string;
    stateId:number;
    xmlMapping: string;
    effectiveFrom: string;
    effectiveTo: string;
    isActive: boolean;
    createdOn: string;
    createdBy: number;
    modifiedOn: string;
    modifiedBy: number;
    noofQuotes: number;
}



