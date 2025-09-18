import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginApi } from '../../classes/api';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ResetPasswordResp } from '../../classes/resetPassword-resp';
import { IResetPasswordReq } from '../../interfaces/base-reset-password-req';
import { IRememberPasswordResp } from '../../interfaces/base-reset-password-resp';

@Injectable({
  providedIn: 'root'
})
export class AQResetPasswordService {


  constructor(
    private http: HttpClient,
    private api: LoginApi
  ) { }

  /* Reset Password */

  ResetPassword(userName: string, otp: string, password: string, confirmPassword: string): Observable<IRememberPasswordResp> {

    let postData: IResetPasswordReq = {
      Username: userName,
      OTP: otp,
      Password: password,
      ConfirmPassword: confirmPassword
    }

    return this.http.post<IRememberPasswordResp>(this.api.resetPasswordApi, postData)
      .pipe(map((resps: IRememberPasswordResp) => {
        return new ResetPasswordResp(resps);
      }))
  }
}
