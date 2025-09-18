import { IQuotesResp, IQuotesData, IQuotes } from '../interfaces/base-quotes-list-resp';
import { QuotesList } from './quotes-list';

export class QuotesResp implements IQuotesResp {
    data: IQuotesData = {
        quote: []
    };
    message: any;
    success: boolean;

    constructor(resp: IQuotesResp) {
        this.message = resp.message;
        this.success = resp.success;
        this.data.quote = this.filterQuotesList(resp.data.quote);
    }

    private filterQuotesList(_resp: IQuotes[]): IQuotes[] {
        return _resp.map((res: IQuotes) => {
            return new QuotesList(res);
        })
    }
}