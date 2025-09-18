export interface IConvertQuickQuoteResponse {
    data: IPolicyGetData;
    success: string;
    message: string
}

export interface IPolicyGetData {
    policyDetails: IPolicyDetails;
    formDefinition: IFormDefinition;
    policies?: any;   
}

export interface IPolicyDetails {
    quoteJson: string;
    quoteDetailsId: number;
    formId: number;
    quoteId: number;
    quoteXml: string;   
    isActive: boolean;
    createdOn: Date;
    createdBy: number;
    modifiedOn?: any;
    modifiedBy?: any;

}

export interface IFormDefinition {
    formId: number;
    formDefinition: string   
    lob: string;
    formType: string;
    state: string;
    xmlMapping?: any;
    effectiveFrom: Date;
    effectiveTo: Date;
    isActive: boolean;
    createdOn: Date;
    createdBy: number;
    modifiedOn: Date;
    modifiedBy: number;
}

