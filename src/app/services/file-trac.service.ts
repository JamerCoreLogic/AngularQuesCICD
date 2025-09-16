import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from '../StaticVariable';

@Injectable({
  providedIn: 'root'
})
export class FileTracService {
  url!: string;
  constructor(private httpClient: HttpClient) { }
  headers = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  GetListOfFileTracData() {
    this.url = AppSettings.API_ENDPOINT + AppSettings.GetListOfFileTracData;
    return this.httpClient.get(this.url);
  }
  GetListOfCompanyName(){
    this.url = AppSettings.API_ENDPOINT + AppSettings.GetListOfCompanyName;
    return this.httpClient.get(this.url);
  }
  GetSurveyTitleList(){
    this.url = AppSettings.API_ENDPOINT + AppSettings.GetSurveyTitleList;
    return this.httpClient.get(this.url);
  }
  GetFileTracActiveCompanies(){
    this.url = AppSettings.API_ENDPOINT + AppSettings.GetFileTracActiveCompanies;
    return this.httpClient.get(this.url);
  }
}
