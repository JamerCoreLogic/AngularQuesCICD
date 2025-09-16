import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { AppSettings } from '../StaticVariable';

@Injectable({
  providedIn: 'root'
})
export class AdjustersService {
  apiUrl!: string;
  headers = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private http: HttpClient) { }

  showlist:Subject<boolean>=new Subject<boolean>()

  updatelist(val:boolean){
    this.showlist.next(val);
  }

  getAdjustersByAddress(data:any): Observable<any> {
    this.apiUrl = AppSettings.API_ENDPOINT + AppSettings.GetUserByAddress;
    return this.http.post<any>(this.apiUrl,JSON.stringify(data),this.headers );
  }
  InitiateRequest(data: any): Observable<any> {
    this.apiUrl = AppSettings.API_ENDPOINT + AppSettings.InitiateRequest;
    return this.http.post<any>(this.apiUrl, data);
  }
  GetClientList(): Observable<any> {
    this.apiUrl = AppSettings.API_ENDPOINT + AppSettings.GetClientList;
    return this.http.get<any>(this.apiUrl);
  }
  GetAssessmentList(): Observable<any> {
    this.apiUrl = AppSettings.API_ENDPOINT + AppSettings.GetAssessmentList;
    return this.http.get<any>(this.apiUrl);
  }
  GetViewProfileByUserId(id:any): Observable<any> {
    this.apiUrl = AppSettings.API_ENDPOINT + AppSettings.GetViewProfileByUserId;
    return this.http.get<any>(`${this.apiUrl}`+`?userid=${id}`);
  }
  GetUserRequestDetailsByUserId(id:any): Observable<any> {
    this.apiUrl = AppSettings.API_ENDPOINT + AppSettings.GetUserRequestDetailsByUserId;
    return this.http.get<any>(`${this.apiUrl}`+`?userid=${id}`);
  }


}
