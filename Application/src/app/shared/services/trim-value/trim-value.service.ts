import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TrimValueService {

  constructor() {

  }

  TrimObjectValue(reqObject: any) {
    Object.keys(reqObject).forEach((key) => {
      if (typeof reqObject[key] == 'string') {
        reqObject[key] = reqObject[key].trim()
      }
    });
    return reqObject;
  }
}