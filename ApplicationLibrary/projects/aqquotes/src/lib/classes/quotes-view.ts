import { IQuotesViewQuote, IQuotesViewAlert, IQuotesViewStage } from '../interfaces/base-quote-view-resp';

export class QuotesView implements IQuotesViewQuote {
    quoteId: number;
    clientId: number;
    ref: string;
    indicationNumber: string;
    quoteNumber: string;
    lobId: number;
    lob: string;
    lobDescription: string;
    transactionId: number;
    transactionCode: string;
    agentId: number;
    agentName: string;
    agencyName: string;
    email?: any;
    phone?: any;
    yearsInsured?: any;
    alfredFlagsId?: any;
    effective_Date?: Date;
    expiry_Date?: Date;
    indicationDate: Date;
    stage: number;
    stageId: string;
    premium?: any;
    stateID: number;
    state: string;
    underwriterID?: any;
    underwriter?: any;
    underwriterAssistantID?: any;
    underwriterAssistant?: any;
    processingTypeID: number;
    processingType: string;
    carrierID: number;
    carrier: string;
    isOpenTask: boolean;
    isActive: boolean;
    createdOn: Date;
    insuredID: number;
    insuredName: string;
    website?: any;
    alerts: IQuotesViewAlert[];
    comments?: any;
    totalQuote: number;
    stages: IQuotesViewStage[];
    underwriterAssistants?: any;
    data: any;

    constructor(resp: IQuotesViewQuote) {
        this.quoteId = resp.quoteId;
        this.insuredID = resp.insuredID;
        this.agentId = resp.agentId;
        this.ref = resp.ref;
        this.insuredName = resp.insuredName;
        this.lob = resp.lob;
        this.agentName = resp.agentName;
        this.yearsInsured = resp.yearsInsured;
        this.stages = resp.stages;
        this.alerts = resp.alerts;
        this.data = resp.stages;
        this.underwriter = resp.underwriter;
        this.underwriterAssistant = resp.underwriterAssistant;
        this.clientId = resp.clientId;
        this.lobId = resp.lobId;
        this.lobDescription = resp.lobDescription;
        this.transactionId = resp.transactionId;
        this.agencyName = resp.agencyName;
        this.email = resp.email;
        this.phone = resp.phone; 
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
        this.effective_Date = resp.effective_Date;



    }
}