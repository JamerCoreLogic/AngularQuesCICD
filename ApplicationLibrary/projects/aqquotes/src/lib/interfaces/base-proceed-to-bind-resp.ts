export interface IProceedToBindPolicyDetails {
    quoteDetailsId: number;
    formId: number;
    quoteId: number;
    quoteXml: string;
    quoteJson: string;
    isActive?: any;
    createdOn: Date;
    createdBy: number;
    modifiedOn?: any;
    modifiedBy?: any;
}

export interface IProceedToBindFormDefinition {
    formId: number;
    formDefinition: string;
    lob: string;
    formType: string;
    state: string;
    xmlMapping: string;
    effectiveFrom: Date;
    effectiveTo: Date;
    isActive: boolean;
    createdOn: Date;
    createdBy: number;
    modifiedOn?: any;
    modifiedBy?: any;
}

export interface IProceedToBindRespData {
    policies?: any;
    policyDetails: IProceedToBindPolicyDetails;
    formDefinition: IProceedToBindFormDefinition;
}

export interface IProceedToBindResp {
    data: IProceedToBindRespData;
    success: boolean;
    message: string;
}
