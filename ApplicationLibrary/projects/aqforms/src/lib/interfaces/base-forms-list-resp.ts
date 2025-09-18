export interface IFormsListResponse {
    data: AQFormResponse;
    success: boolean;
    message: string
}

export interface AQFormResponse {
    aQFormResponses: AQFormData[]
}


export interface AQFormData {
    formId: number;
    formDefinition: string;
    lobCode: string;
    formType: string;
    stateCode: string;
    xmlMapping: string;
    effectiveFrom: string;
    effectiveTo: string;
    isActive: boolean;
    createdOn: string;
    createdBy: number;
    modifiedOn: string;
    modifiedBy: number

}

