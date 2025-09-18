import { IConvertQuickQuoteRequest } from '../interfaces/base-convert-quick-quote-req';

export class ConvertQuickQuoteRequest implements IConvertQuickQuoteRequest {

    QuoteId: number;
    FormId: number;
    AgentId: number;
    UserId: number;
    QuoteType: string;
    IsFullQuote: boolean;
    LOB: string;
    State: string;
    QuoteDetails: string

    constructor() {
        this.AgentId = 0;
        this.UserId = 0;
        this.QuoteId = 0;
        this.FormId = 0;
        this.LOB = "";
        this.State = "";
        this.QuoteType = "";
        this.QuoteDetails = "";

    }

}