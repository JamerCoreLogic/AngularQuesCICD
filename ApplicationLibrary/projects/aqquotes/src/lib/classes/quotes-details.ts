import { IQuotes } from '../interfaces/base-quotes-list-resp';

export class QuotesDetails   {
    
    quoteId: number;
    
    constructor(resp:IQuotes) {        
        this.quoteId = resp.quoteId;
    }
}