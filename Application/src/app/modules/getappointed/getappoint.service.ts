import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiUrlSettings } from 'src/app/global-settings/url-settings';

@Injectable({
  providedIn: 'root'
})
export class GetappointService {
  baseUrl: string = new ApiUrlSettings().getUrlForAPI();
  private appointAgentApi = '/api/Users/RegisterAgentAndSubmitBusiness';
  private downloadDocApi = '/api/Users/DownloadPdf?fileName=';
  constructor(private httpClient: HttpClient) { }

  headers = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  appointAgent(data: any) {
    let url = this.baseUrl + this.appointAgentApi;
    //let url = 'http://localhost:52796/api/Users/RegisterAgentAndSubmitBusiness';
    return this.httpClient.post(url, JSON.stringify(data), this.headers);
  }
  downloadPdf(fileName: string): Observable<Blob> {
    let url = this.baseUrl + this.downloadDocApi + fileName;
    // let url = 'http://localhost:52796/api/Users/DownloadPdf?fileName=' + fileName;
    return this.httpClient.get(url, { responseType: 'blob' });
  }
}
