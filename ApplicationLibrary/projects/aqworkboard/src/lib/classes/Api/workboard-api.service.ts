import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class WorkboardApi {

  private baseUrl = "/api/Kpi/GetWorkBoardData";
  private newWorkboardData = "/api/Kpi/GetWorkBoardDataNew";
  private periodUrl = "/api/Kpi/GetWorkBoardPeriods";

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
