import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MGAConfgApi } from '../class/mga-config-api';
import { map } from 'rxjs/operators';
import { IMGAConfigResp } from '../interfaces/base-mga-config-resp';
import { MGAConfigResp } from '../class/mga-config-resp';
import { Observable } from 'rxjs';
import { ISaveMGAConfigReq } from '../interfaces/base-save-mga-config-req';

@Injectable({
  providedIn: 'root'
})
export class MgaConfigService {

  constructor(
    private _httpClient: HttpClient,
    private _api: MGAConfgApi
  ) { }

  MGADetails(UserId): Observable<IMGAConfigResp> {
    return this._httpClient.post<IMGAConfigResp>(this._api.MGACongiApi, {
      UserId: UserId
    }).pipe(
      map((resp: IMGAConfigResp) => {
        if (resp) {
          return new MGAConfigResp(resp)
        }
      })
    )
  }

  SaveMgaConfiguration(mgaConfig: ISaveMGAConfigReq) {
    return this._httpClient.post(this._api.SaveMgaConfigApi, mgaConfig)
      .pipe(
        map((resp: IMGAConfigResp) => {
          return resp;
        })
      )
  }

}
