export interface IPolicyGetResponse {
    data: IPolicyGetData;
    success: string;
    message: string
}

export interface IPolicyGetData {
    policyDetails: IPolicyDetails;
    formDefinition: IFormDefinition;
    policies: IPolicies;

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
    modifiedOn: Date;
    modifiedBy: number;
}



export interface Insureds {
    insuredId: number;
    firstName: string;
    middleName: string;
    lastName: string;
    titleId?: any;
    phoneCell: string;
    phoneHome: string;
    phoneOffice: string;
    fax: string;
    email: string;
    website: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    zip: string;
    isActive: boolean;
    createdBy?: any;
    createdOn: Date;
    modifiedBy?: any;
    modifiedOn?: any;
}

export interface IPolicies {
    quoteId: number;
    controlNumber: string;
    ref?: any;
    lob: string;
    transactionCode: string;
    quoteDetails?: any;
    agentId: number;
    indicationNumber: string;
    submissionNumber?: any;
    quoteNumber: string;
    policyNumber?: any;
    isTempEndorsement?: any;
    endorsementNumber?: any;
    endorsementDate?: any;
    endorsementExpiryDate?: any;
    effectiveDate: Date;
    expiryDate: Date;
    indicationDate: Date;
    submissionDate?: any;
    quoteDate: Date;
    bindRequestDate: Date;
    inceptionDate: Date;
    cancelDate?: any;
    renewalDate?: any;
    finalCancelDate?: any;
    reinstateDate?: any;
    indicationVersion?: any;
    quoteVersion?: any;
    policyVersion?: any;
    stageId: string;
    isOpenTask: boolean;
    isActive: boolean;
    isCancelled: boolean;
    isClosed: boolean;
    createdBy?: any;
    createdOn: Date;
    modifiedBy?: any;
    modifiedOn?: any;
    insureds: Insureds;
}
