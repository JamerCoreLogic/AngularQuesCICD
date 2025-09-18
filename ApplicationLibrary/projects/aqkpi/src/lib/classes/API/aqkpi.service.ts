import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AqkpiService {

  constructor() { }  

  private _getAqkpi =  '/AQAPI/api/Kpi/GetAgentPerformanceData';

  get aqkpiApi(){
      return this._getAqkpi;
  }

  set aqkpiApiEndPoint(value){
    this._getAqkpi = value + this._getAqkpi;
  }
}
