import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { AppSettings } from '../StaticVariable';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  apiUrl!: string;
  headers = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private http: HttpClient) { }
  GetUserListForReports(){
    this.apiUrl = AppSettings.API_ENDPOINT + AppSettings.GetUserListForReports;
    return this.http.get<any>(this.apiUrl);
  }
  GetFiledsListForReports(){
    this.apiUrl = AppSettings.API_ENDPOINT + AppSettings.GetFiledsListForReports;
    return this.http.get<any>(this.apiUrl);
  }
  GetRequestedListForReportDashboard(data:any){
    this.apiUrl = AppSettings.API_ENDPOINT + AppSettings.GetRequestedListForReportDashboard
    return this.http.post(this.apiUrl ,JSON.stringify(data), this.headers);
  }
  GetActiveModuleColumns(){
    this.apiUrl = AppSettings.API_ENDPOINT + AppSettings.GetActiveModuleColumns;
    return this.http.get<any>(this.apiUrl);
  }
  AddUpdateCustomView(data:any){
    this.apiUrl = AppSettings.API_ENDPOINT + AppSettings.AddUpdateCustomView;
    return this.http.post(this.apiUrl ,JSON.stringify(data), this.headers);
  }
  GetCustomView(id:any){
    this.apiUrl = AppSettings.API_ENDPOINT + AppSettings.GetCustomView + id;
    return this.http.get<any>(this.apiUrl);
  }
  DeleteCustomView(id:any){
    this.apiUrl = AppSettings.API_ENDPOINT + AppSettings.DeleteCustomView + id;
    return this.http.post(this.apiUrl, this.headers);
  }
  GetCustomViewList(){
    this.apiUrl = AppSettings.API_ENDPOINT + AppSettings.GetCustomViewList;
    return this.http.get<any>(this.apiUrl);
  }
}

