export interface IQuoteViewReq {
    AgentId: number;
    UserId: number;
    AgencyId: number;
    //ClientID: number;
    PageNumber: number;
    PageSize: string;
    SortingOrder: string;
    SortingColumn: string;
    SearchText: string;
    QuoteId?: number;
    EffectiveFromDate?: Date;
    EffectiveToDate?: Date;
    Period?: string;
    WorkboardStatus?: string;

    // Advance search property
    SearchType?: string;
    InsuredName?: string;
    AgentName?: string;
    State?: string;
    TranscationType?: string;
    CarrierID?: number;
    Lob?: string;
    QuoteNumber?: string;
    
    PremiumStart?: number;
    PremiumEnd?: number;
    ProcessingTypeId?: string;
    AlfredFlags?: string;
    Status?:string;
    PolicyStartDateFrom?:string;
    PolicyStartDateTo?:string; 
    PolicyExpiryDateFrom?: string;
    PolicyExpiryDateTo ?: string;
}

