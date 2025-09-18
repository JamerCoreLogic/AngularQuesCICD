import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SetDateService {

  constructor() { }

  setDate(value){
    let dateValue = new Date(value);
    let UTCDate = Date.UTC(dateValue.getFullYear(), dateValue.getMonth(), dateValue.getDate()) - dateValue.getTimezoneOffset();
      return  new Date(UTCDate);
  }
}
