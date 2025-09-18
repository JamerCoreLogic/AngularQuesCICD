export interface IQuotesResp {
    data: IQuotesData;
    success: boolean;
    message?: any;
}

export interface IQuotesData {
    quote: IQuotes[];
}

export interface IQuotesAlert {
    alferdAlertTypeID: number;
    description: string;
    iconURL: string;  
}

export interface IQuoteStage {
    status: string;    
    premium: number;
    refundPremium: number;
    renewal_Date?: any;
    endorsement_Date?: any;
    cancel_Date?: any;    
    isActive: boolean;
}

export interface IQuotes {
    quoteId: number;
    insuredID:number;
    lob: string;
    transactionCode: string;
    quoteDetails?: any;
    agentId: number;
    agentName: string;
    oldAgentId?: any;
    oldAgentTransferDate?: any;
    indicationNumber?: any;
    submissionNumber?: any;
    ref: string;
    quoteNumber: string;
    policyNumber: string;
    yearsInsured: string;
    isTempEndorsement?: any;
    endorsementNumber?: any;  
    endorsementExpiryDate?: any;
    bindRequestNumber?: any; 
    indicationDate?: any;
    submissionDate?: any;
    quoteDate: Date;
    bindRequestDate?: any;
    inceptionDate: Date;
    indicationVersion?: any;
    quoteVersion?: any;
    policyVersion?: any;
    stageId: number;
    isOpenTask: boolean;
    isActive: boolean;
    isCancelled?: any;
    isClosed?: any;
    createdBy?: any;
    insuredName: string;
    alfredFlag: string;
    alfredAlerts?: any;
    alerts: IQuotesAlert[];
    currentStatus?: any;
    stages: IQuoteStage[];
    controlNumber: string;
    effective_Date: string;
    expiry_Date: string;
    underwriter:string;

    EffectiveDate: Date;
    ExpiryDate: Date;
    RenewalDate: Date;
    EndorsementDate: Date;
    CancelDate: Date;
    clientId: number;
    lobId: number;
    lobDescription: string;
    transactionId: number;
    agencyName: string;
    email?: any;
    phone?: any;
    alfredFlags?: any;
    alfredFlagsId?: any;
    stage: number;
    premium?: number;
    stateID: number;
    state: string;
    underwriterID?: any;
    underwriterAssistantID?: any;
    underwriterAssistant?: any;
    processingTypeID: number;
    processingType: string;
    carrierID: number;
    carrier: string;
    createdOn: Date;    
    website?: any;    
    underwriterAssistants?: any;
}
