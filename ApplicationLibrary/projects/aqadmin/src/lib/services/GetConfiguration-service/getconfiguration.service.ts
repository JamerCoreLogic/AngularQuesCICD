import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ParameterApi } from '../../classes/parameter-api';
import { map } from 'rxjs/operators';
import { IGetConfiguration } from '../../interfaces/getConfigration-resp';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class GetConfigurationService {

  constructor(
    private _http: HttpClient,
    private api: ParameterApi
  ) { }

  GetConfiguration(ClientId?: any):Observable<IGetConfiguration> {
    let mgaCofiguration: IGetConfiguration = JSON.parse(sessionStorage.getItem('mgaconfiguration'));
    if (mgaCofiguration) {
      return new Observable<IGetConfiguration>(observer => {
        observer.next(mgaCofiguration);
        observer.complete();
      });
    } else {
      return this._http.post<IGetConfiguration>(this.api.GetConfigurationApi, {
        "ClientId": ClientId
      }).pipe(
        map((resp: IGetConfiguration) => {
          if (resp && resp.data) {
            sessionStorage.setItem('mgaconfiguration', JSON.stringify(resp));
            return resp
          }
        })
      )
    }
  }
}