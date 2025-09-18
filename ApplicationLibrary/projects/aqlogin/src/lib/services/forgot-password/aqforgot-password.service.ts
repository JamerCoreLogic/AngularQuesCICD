import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginApi } from '../../classes/api';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ForgetPasswordResp } from '../../classes/forgotPassweord-resp';
import { IForgotPasswordReq } from '../../interfaces/base-forgot-password-req';
import { IBaseForgotPasswordResp } from '../../interfaces/base-forgot-password-resp';


@Injectable({
  providedIn: 'root'
})

export class AQForgotPasswordService {

  constructor(
    private http: HttpClient,
    private api: LoginApi
  ) { }


  /* Forget Password */

  ForgetPassword(userName: string): Observable<IBaseForgotPasswordResp> {
    let postData: IForgotPasswordReq = {
      Username: userName
    }
    return this.http.post<IBaseForgotPasswordResp>(this.api.forgetPasswordApi, postData)
      .pipe(map((resps: IBaseForgotPasswordResp) => {
        return new ForgetPasswordResp(resps);
      }))
  }
}
