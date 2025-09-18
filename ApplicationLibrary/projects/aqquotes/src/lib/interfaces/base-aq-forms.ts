export interface AQFormRespons {
    formId: number;
    formDefinition: string;
    lob: string;
    formType: string;
    state: string;
    xmlMapping?: any;
    effectiveFrom: Date;
    effectiveTo: Date;
    isActive: boolean;
    createdOn: Date;
    createdBy: number;
    modifiedOn?: any;
    modifiedBy?: any;

    
    formData: string;
    formExcel: string;
    fileName: string;
    lobId?: any;
    formTypeId?: any;
    stateId?: any;
    lobCode: string;
    lobCodeDescription: string;
   
    formTypeDescription: string;
    stateCode: string;
    stateCodeDescription: string;
    
    noofQuotes?: any;
}

export interface IAQFormsData {
    aQFormResponses: AQFormRespons[];
}

export interface IAQFormsResp {
    data: IAQFormsData;
    success: boolean;
    message: string;
}




