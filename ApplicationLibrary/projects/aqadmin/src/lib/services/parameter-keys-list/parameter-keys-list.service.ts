import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ParameterApi } from '../../classes/parameter-api';
import { IBaseParameterKeysList } from '../../interfaces/base-parameer-keys-list';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ParameterKeysListService {

  constructor(
    private _http: HttpClient,
    private _api: ParameterApi
  ) { }

  ParameterKeysList(userId: any) {
    return this._http.post(this._api.ParameterKeysListAPI, {
      "UserId": userId
    }).pipe(
      map((resp: IBaseParameterKeysList) => {
        return resp;
      })
    )
  }

}
