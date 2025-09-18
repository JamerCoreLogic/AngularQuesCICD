import { IQuotes, IQuotesAlert, IQuoteStage } from '../interfaces/base-quotes-list-resp';

export class QuotesList implements IQuotes {
   
    quoteId: number;
    insuredID: number;
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
    data:any;

/* ----------- */


    clientId: number
    lobId: number;    
    lobDescription: string;
    transactionId: number;    
    agencyName: string;
    email: string;
    phone: string;   
    alfredFlags?: any;
    alfredFlagsId?: any;
    stage: number;
    premium?: any;
    stateID: number;
    state: any;
    underwriterID?: any;
    processingTypeID: number;
    processingType: string;
    carrierID: number;
    carrier: string;
    createdOn: Date;
    underwriterAssistant?: any;
    underwriterAssistants?:any;

    constructor(resp:IQuotes) { 
        this.quoteId=resp.quoteId;
        this.insuredID = resp.insuredID;
        this.agentId=resp.agentId;
        this.ref = resp.ref;
        this.insuredName = resp.insuredName;
        this.lob = resp.lob;
        this.agentName = resp.agentName;
        this.effective_Date  = resp.effective_Date;        
        this.expiry_Date = resp.expiry_Date;
        this.yearsInsured  = resp.yearsInsured;
        this.alfredFlag = resp.alfredFlag;
        this.stages = resp.stages;   
        this.alerts = resp.alerts;   
        this.data = resp.stages; 
        this.controlNumber = resp.controlNumber;
        this.underwriter = resp.underwriter;
        this.underwriterAssistant = resp.underwriterAssistant;

        /* -- */


        
    this.clientId = resp.clientId;
    this.lobId = resp.lobId;    
    this.lobDescription = resp.lobDescription;
    this.transactionId = resp.transactionId;    
    this.agencyName = resp.agencyName;
    this.email = resp.email;
    this.phone = resp.phone;   
    this.alfredFlags = resp.alfredFlag;
    this.alfredFlagsId = resp.alfredFlagsId;
    this.stage = resp.stage;
    this.premium = resp.premium;
    this.stateID = resp.stateID;
    this.state = resp.state;
    this.underwriterID = resp.underwriterID;
    this.processingTypeID = resp.processingTypeID;
    this.processingType = resp.processingType;
    this.carrierID = resp.carrierID;
    this.carrier = resp.carrier;
    
    this.underwriterAssistants = resp.underwriterAssistants;
    }
}