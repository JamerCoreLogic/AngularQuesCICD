import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AlfredAlertAPI {
  private alfredAlertApi = '/api/Alert/GetAlfredAlert';
  constructor() {
  }

  get AlfredAlertAPI() {
    return this.alfredAlertApi;
  }

  set AlfredAlertAPIEndPoint(value) {
    this.alfredAlertApi = value + this.alfredAlertApi;
  }

}
