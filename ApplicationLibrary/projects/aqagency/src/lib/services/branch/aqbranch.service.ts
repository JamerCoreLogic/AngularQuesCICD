import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ICreateBranchResp } from '../../interfaces/base-create-branch-resp';
import { HttpClient } from '@angular/common/http';
import { AgencyApi } from '../../classes/agency-api';
import { ICreateBranchReq } from '../../interfaces/base-create-branch-req';
import { map } from 'rxjs/operators';
import { CreateBranchResp } from '../../classes/create-branch-resp';
import { AQAgencyModule } from '../../aqagency.module';

@Injectable({
  providedIn: "root"
})
export class AQBranchService {

  constructor(
    private _http: HttpClient,
    private _agencyApi: AgencyApi
  ) { }

  UpdateBranch(req: ICreateBranchReq): Observable<ICreateBranchResp> {
    return this._http.post<ICreateBranchResp>(this._agencyApi.updateBranchApi, req)
      .pipe(
        map((resp: ICreateBranchResp) => {
          return new CreateBranchResp(resp);
        })
      );
  }
}
