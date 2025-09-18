import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { error } from 'protractor';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { LoginApi } from '../../classes/api';
import { AQSessionService } from '../data-clearance/aqsession.service';
import { AQUserInfo } from '../data-storage/user-info/aquser-info.service';

@Injectable({
  providedIn: 'root'
})
export class AQLogoutService {

  constructor(
    private _session:AQSessionService,
    private _api: LoginApi,
    private _router: Router,
    private _http: HttpClient,
    private _userInfo:AQUserInfo
  ) { }

  Logout():Observable<any> {    
   return this._http.post(this._api.revokeTokenApi,{
      token: this._userInfo.getRefreshToken()
    },{headers:{'token':'no'}}).pipe(
      map(resp=>{
        this._router.navigateByUrl('/');
        sessionStorage.clear();
        return resp;
      }),
      catchError((error:HttpErrorResponse)=>{
        this._router.navigateByUrl('/');
        return throwError(error);
      })
    )
   
  }  
}
