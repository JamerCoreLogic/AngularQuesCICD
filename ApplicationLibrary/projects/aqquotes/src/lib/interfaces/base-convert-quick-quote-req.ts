export interface IConvertQuickQuoteRequest{   
    QuoteId: number;
    FormId: number;
    AgentId: number;
    UserId: number;
    QuoteType: string;
    IsFullQuote:boolean;
    LOB: string;
    State: string;
    IsOpenTask:boolean;
    QuoteDetails:string
}


export interface IProceedToBindReq {
    AgentId: number;
    ClientID: number;
    LOB: string;
    QuoteDetails: string;
    QuoteType: string;
    State: string;
    UserId: number;
    XMLObject: string;
    IsOpenTask: boolean;
    QuoteId: number;
    FormId: number;
    IsFullQuote: boolean;
    IsPolicyBindQuote: boolean;
}


export interface IIssueQuoteRequest {
    AgentId: number;
    ClientID: number;
    LOB: string;
    QuoteDetails: string;
    QuoteType: string;
    State: string;
    UserId: number;
    XMLObject: string;
    IsOpenTask: boolean;
    QuoteId: number;
    FormId: number;
    IsFullQuote: boolean;
    IsPolicyBindQuote: boolean;
    IsPolicyIssueQuote: boolean;
}