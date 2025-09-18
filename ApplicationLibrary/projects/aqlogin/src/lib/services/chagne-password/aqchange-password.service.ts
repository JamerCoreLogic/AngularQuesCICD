import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginApi } from '../../classes/api';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ChangePasswordResp } from '../../classes/changePassword-resp';
import { IChagenPasswordReq } from '../../interfaces/base-change-password-req';
import { IBaseForgotPasswordResp } from '../../interfaces/base-forgot-password-resp';

@Injectable({
  providedIn: 'root'
})
export class AQChangePasswordService {


  constructor(
    private http: HttpClient,
    private api: LoginApi
  ) { }

  /* Change Password */

  ChangePassword(userName: string, oldPassword: string, newPassword: string): Observable<IBaseForgotPasswordResp> {
    let postData: IChagenPasswordReq = {
      Username: userName,
      OldPassword: oldPassword,
      NewPassword: newPassword
    }

    return this.http.post<IBaseForgotPasswordResp>(this.api.changePasswordApi, postData)
      .pipe(map((resps: IBaseForgotPasswordResp) => {
        return new ChangePasswordResp(resps);
      }))
  }
}
