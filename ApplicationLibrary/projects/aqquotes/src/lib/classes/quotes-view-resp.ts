import { IQuotesViewResp, IQuotesViewData, IQuotesViewQuote } from '../interfaces/base-quote-view-resp';
import { QuotesView } from './quotes-view';



export class QuotesViewResp implements IQuotesViewResp {
    data : IQuotesViewData = {
        quote : [],
        totalQuote: 0,
        quotes:[]
    };
    message;
    success;

    constructor(resp: IQuotesViewResp) {
        this.message = resp.message;
        this.success = resp.success;
        this.data.totalQuote = resp.data.totalQuote;
        this.data.quote = this.filterQuotesList(resp.data.quote);
        this.data.quotes  = resp.data.quotes;     
    }

    private filterQuotesList(_resp: IQuotesViewQuote[]): IQuotesViewQuote[] {
        return _resp.map((res: IQuotesViewQuote) => {
            return new QuotesView(res);
        });

    }
}