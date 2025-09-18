export interface IFormCreateResponse {
    data: AQFormCreateResponse;
    success:boolean;
    message:string;
    
}

export interface AQFormCreateResponse {
    aQForms: AQFormCreateData
}


export interface AQFormCreateData {
    formId: number;
    formDefinition: string;
    lobCode: string;
    formType: string;
    FileName:string;
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