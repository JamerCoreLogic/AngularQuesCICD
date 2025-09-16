import { Injectable } from '@angular/core';
import { HttpClient,HttpParams  } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppSettings } from '../StaticVariable';

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {
  apiUrl!: string;

  constructor(private http: HttpClient) { }

  // GetDataForBindUIScreen(data: any): Observable<any> {
  //   this.apiUrl = AppSettings.API_ENDPOINT + AppSettings.GetDataForBindUIScreen;
  //   return this.http.get<any>(this.apiUrl,'?'+'token=' + data);
  // }
  GetDataForBindUIScreen(data: any): Observable<any> {
    this.apiUrl = AppSettings.API_ENDPOINT + AppSettings.GetDataForBindUIScreen;
    const options = {
      params: new HttpParams().set('token',data)
    };
    return this.http.get<any>(this.apiUrl, options);
  }
  
  SubmitResponce(data: any): Observable<any> {
    this.apiUrl = AppSettings.API_ENDPOINT + AppSettings.SubmitResponce;
    return this.http.post<any>(this.apiUrl, data);
  }

}
