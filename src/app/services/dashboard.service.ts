import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { AppSettings } from '../StaticVariable';;

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  apiUrl!: string;
  headers = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

constructor(private http: HttpClient) { }

GetDashboardData(): Observable<any> {
  this.apiUrl = AppSettings.API_ENDPOINT + AppSettings.GetDashboardData;
  return this.http.get<any>(this.apiUrl);
}
GetActiveUserPercentage(): Observable<any> {
  this.apiUrl = AppSettings.API_ENDPOINT + AppSettings.GetActiveUserPercentage;
  return this.http.get<any>(this.apiUrl);
}
MarkedCompleted(data: any , commRequestId:any): Observable<any> {
  this.apiUrl = AppSettings.API_ENDPOINT + AppSettings.MarkedCompleted+'?CommRequestId='+data+'&AdjusterResponseId='+commRequestId;
  return this.http.post<any>(this.apiUrl, this.headers);
}
GetCommunicationResponse(data: any): Observable<any> {
  this.apiUrl = AppSettings.API_ENDPOINT + AppSettings.GetCommunicationResponse+'?AdjusterResponseId='+data;
  return this.http.get<any>(this.apiUrl);
}


}
