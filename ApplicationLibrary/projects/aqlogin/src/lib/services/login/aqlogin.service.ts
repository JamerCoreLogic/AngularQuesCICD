import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { LoginResp } from '../../classes/login-resp'
import { IUser, IAgency, IAgent, IRole, ILoginResp, IRoleRight } from '../../interfaces/base-login-resp'
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators'
import { LoginApi } from '../../classes/api';
import { ILoginReq } from '../../interfaces/base-login-req';
import { AQSessionService } from '../data-clearance/aqsession.service';
import { IGuestAddReq } from '../../interfaces/base-guest-req';
import { Router } from '@angular/router';
import { AQUserInfo } from '../data-storage/user-info/aquser-info.service';

@Injectable({
  providedIn: 'root'
})

export class AQLoginService {

  private _user: IUser;
  private _agency: IAgency;
  private _agent: IAgent;
  private _role: IRole[];
  private _roleRights: IRoleRight[];

  constructor(
    private http: HttpClient,
    private api: LoginApi,
    private session: AQSessionService,
    private router: Router,
    private _userInfo: AQUserInfo
  ) { }

  LoginAuthentication(userName: string, password: string, rememberMe?: boolean): Observable<ILoginResp> {

    let postData: ILoginReq = {
      Username: userName,
      Password: password
    }

    /* Clear all session storage before login */
    this.session.clearSession();

    return this.http.post<ILoginResp>(this.api.loginApi, postData, { headers: { 'token': 'no' } })
      .pipe(map((resps: ILoginResp) => {

        /* Remember Me Features */
        let savedUserList: any[] = [];
        let savedUser = localStorage.getItem('savedUser');
        if (savedUser) {
          savedUserList = JSON.parse(savedUser);
        }

        if (rememberMe) {
          if (savedUserList && savedUserList.length) {
            let isUpdated: boolean = false;
            savedUserList = savedUserList.map(user => {
              if (user.userName == userName) {
                isUpdated = true;
                user.userName = userName;
                user.password = password;
                user['latestLogin'] = true
              } else {
                user['latestLogin'] = false
              }
              return user;
            });
            if (!isUpdated) {
              savedUserList.push({
                'userName': userName,
                'password': password,
                'latestLogin': true
              });
            }
          } else {
            savedUserList.push({
              'userName': userName,
              'password': password,
              'latestLogin': true
            });
          }
          localStorage.setItem('savedUser', JSON.stringify(savedUserList));
        } else {
          if (savedUserList && savedUserList.length) {
            savedUserList = savedUserList.filter(user => user.userName != userName);
          }
          localStorage.setItem('savedUser', JSON.stringify(savedUserList));
        }

        /* filter data and stored in session */
        if (resps && resps.data !== null) {
          this._user = resps.data.user;
          sessionStorage.setItem('user', JSON.stringify(this._user));
          this._agency = resps.data.agency;
          sessionStorage.setItem('agency', JSON.stringify(this._agency));
          this._agent = resps.data.agent;
          sessionStorage.setItem('agent', JSON.stringify(this._agent));
          this._role = resps.data.role;
          sessionStorage.setItem('role', JSON.stringify(this._role));
          this._roleRights = resps.data.roleRight;
          sessionStorage.setItem('rights', JSON.stringify(this._roleRights));
        }

        return new LoginResp(resps);
      }),
        catchError((error: HttpErrorResponse) => {
          this.router.navigateByUrl('/');
          return throwError(error);
        })
      );
  }

  CreateGuest(req: IGuestAddReq): Observable<ILoginResp> {
    return this.http.post<ILoginResp>(this.api.CreateGuestApi, req, { headers: { 'token': 'no' } })
      .pipe(
        map((resps: ILoginResp) => {
          if (resps) {

            if (resps && resps.data !== null) {
              this._user = resps.data.user;
              sessionStorage.setItem('user', JSON.stringify(this._user));
              this._agency = resps.data.agency;
              sessionStorage.setItem('agency', JSON.stringify(this._agency));
              this._agent = resps.data.agent;
              sessionStorage.setItem('agent', JSON.stringify(this._agent));
              this._role = resps.data.role;
              sessionStorage.setItem('role', JSON.stringify(this._role));
              this._roleRights = resps.data.roleRight;
              sessionStorage.setItem('rights', JSON.stringify(this._roleRights));
            }

            return new LoginResp(resps);
            //return new AgentAd(resp);
          }
        })
      )
  }


  refreshToken(): Observable<ILoginResp> {
    return this.http.post(this.api.refreshTokenApi, {
      token: this._userInfo.getRefreshToken()
    }, { headers: { 'refresh': 'no', 'token': 'no' } }).pipe(

      tap((resps: ILoginResp) => {
        if (resps && resps.data !== null) {
          console.log('Access token refreshed!');
          this._user = resps.data.user;
          sessionStorage.setItem('user', JSON.stringify(this._user));
          this._agency = resps.data.agency;
          sessionStorage.setItem('agency', JSON.stringify(this._agency));
          this._agent = resps.data.agent;
          sessionStorage.setItem('agent', JSON.stringify(this._agent));
          this._role = resps.data.role;
          sessionStorage.setItem('role', JSON.stringify(this._role));
          this._roleRights = resps.data.roleRight;
          sessionStorage.setItem('rights', JSON.stringify(this._roleRights));
        } else {
          this.router.navigateByUrl('/');
        }
        return new LoginResp(resps);

      }),
      catchError((error: HttpErrorResponse) => {
        this.router.navigateByUrl('/');
        return throwError(error);
      })
    )
  }

}
