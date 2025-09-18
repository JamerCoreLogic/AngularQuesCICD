import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class WorkboardApi {

  private baseUrl = "/AQAPI/api/Kpi/GetWorkBoardData";
  private newWorkboardData = "/AQAPI/api/Kpi/GetWorkBoardDataNew";
  private periodUrl = "/AQAPI/api/Kpi/GetWorkBoardPeriods";

  constructor() { }

  get getWorkBoardApi() {
    return this.baseUrl;
  }

  get getNewWorkBoardApi() {
    return this.newWorkboardData;
  }

  get getperioddApi() {
    return this.periodUrl;
  }

  set WorkboardApiEndPoint(value) {
    this.baseUrl = value + this.baseUrl;
    this.newWorkboardData = value + this.newWorkboardData;
    this.periodUrl = value + this.periodUrl;
  }

}
