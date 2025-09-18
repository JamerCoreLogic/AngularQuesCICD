import { Injectable } from '@angular/core';
import { IQuotes } from '../../../interfaces/base-quotes-list-resp';
import { QuotesDetails as Quotes } from '../../../classes/quotes-details';

@Injectable({
  providedIn: 'root'
})
export class QuotesDetails {

  private _quotesList: IQuotes[];

  constructor() { }

  QuotesDetails(quotesId: any) {

    this._quotesList = JSON.parse(sessionStorage.getItem('QuotesData'));
    if (this._quotesList.length > 0) {
      let _quotesList = this._quotesList
        .filter((quotes: IQuotes) => {
          return quotes.quoteId == quotesId;
        })
        .map((quotes: IQuotes) => {
          return new Quotes(quotes);
        })
      return _quotesList;
    }
  }
}
