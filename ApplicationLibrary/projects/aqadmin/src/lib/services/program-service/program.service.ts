import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ParameterApi } from '../../classes/parameter-api';

import { map } from 'rxjs/operators';
import { MGAProgramsResp } from '../../classes/mga-program-resp';
import { IMGAProgramsResp } from '../../interfaces/base-mga-programs-resp';

@Injectable({
  providedIn: 'root'
})
export class ProgramService {

  constructor(
    private _http: HttpClient,
    private api: ParameterApi
  ) { }

  MGAPrograms(UserId: number, ClientId: any) {
    return this._http.post(this.api.mgaProgramsApi, {
      "UserId": UserId,
      "ClientId": ClientId
    }).pipe(
      map((resp: IMGAProgramsResp) => {
        if (resp && resp.data) {
          return new MGAProgramsResp(resp);
        }
      })
    )
  }

}
