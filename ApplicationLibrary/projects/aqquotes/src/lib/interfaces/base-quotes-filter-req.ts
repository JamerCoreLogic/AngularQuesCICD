export interface IQuotesFilterReq {
    UserId?: number;
    AgencyId?: number;
    AgentId?: number;
    Ref?: string;
    InsuredName?: string;
    Lob?: string;
    AgentName?: string;
    //EffectiveDate?: string;
    //ExpiryDate?: string;
    TranscationType?: string;
    Status?: string;
    PremiumStart?: string;
    PremiumEnd?: string;
    AlfredFlags?: string;
    WorkboardStatus?: string;
    Period?:string;
    State: string;
    CarrierID: string; 
    EffectiveFromDate?:string;
    EffectiveToDate?:string;
    ExpirationFromDate?:string;
    ExpirationToDate?:string
}