import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IManageUserReq } from '../../interfaces/base-mange-user-req';
import { LoginApi } from '../../classes/api';
import { ILoginResp, IUser, IAgency, IAgent, IRole } from '../../interfaces/base-login-resp';
import { map } from 'rxjs/operators';
import { LoginResp } from '../../classes/login-resp';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ManageUserService {

  private _user: IUser;
  private _agency: IAgency;
  private _agent: IAgent;
  private _role: IRole[]

  constructor(
    private _http: HttpClient,
    private _api: LoginApi
  ) { }

  ManageUser(req: IManageUserReq):Observable<ILoginResp> {
    return this._http.post(this._api.manageUserApi, req)
      .pipe(
        map((resps: ILoginResp) => {
          if (resps && resps.data !== null) {

            this._user.isLocked = resps.data.user.isLocked;
            this._user.newUser = resps.data.user.newUser;            
            this._user.resetPassword = resps.data.user.resetPassword;
            this._user.userId = resps.data.user.userId;
            this._user.userName = resps.data.user.userName;

            sessionStorage.setItem('user', JSON.stringify(this._user));
            this._agency = resps.data.agency;
            sessionStorage.setItem('agency', JSON.stringify(this._agency));
            this._agent = resps.data.agent;
            sessionStorage.setItem('agent', JSON.stringify(this._agent));
            this._role = resps.data.role;
            sessionStorage.setItem('role', JSON.stringify(this._role));
            return new LoginResp(resps);
          }
        })
      )
  }

}
