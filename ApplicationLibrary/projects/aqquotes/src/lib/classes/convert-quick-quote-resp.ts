import { IConvertQuickQuoteResponse } from '../interfaces/base-convert-quick-quote-resp';

export class ConvertQuickQuoteResp implements IConvertQuickQuoteResponse {
    data;
    message;
    success;

    constructor(resp:IConvertQuickQuoteResponse){
        this.message = resp.message;
        this.success = resp.success;
    }
}