import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class LoginApi { 
    private _loginApi: string = "/AQAPI/api/users/authenticateuser";
    private _forgetPasswordApi:string = "/AQAPI/api/Users/ForgotPassword";
    private _changePasswordApi:string = "/AQAPI/api/Users/ChangePassword";
    private _resetPasswordApi:string = "/AQAPI/api/Users/ResetPassword";
    private _manageUserApi:string = "/AQAPI/api/ManageAccount/UpdateAccount";
    private createGuestApi = '/AQAPI/api/Users/RegisterGuestUser';
    private _revokeTokenApi = "/AQAPI/api/users/revoketoken";
    private _refreshTokenApi = "/AQAPI/api/users/refreshtoken";

    get loginApi() {
        return this._loginApi;
    }

    get forgetPasswordApi(){
        return this._forgetPasswordApi;
    }

    get changePasswordApi() {
        return this._changePasswordApi;
    }

    get resetPasswordApi() {
        return this._resetPasswordApi;
    }

    get manageUserApi(){
        return this._manageUserApi;
    }

    get CreateGuestApi() {
        return this.createGuestApi;
    }

    get revokeTokenApi() {
        return this._revokeTokenApi;
    }

    get refreshTokenApi(){
        return this._refreshTokenApi;
    }

    set loginApiEndPoint(value){
        this._loginApi = value + this._loginApi;
        this._forgetPasswordApi = value + this._forgetPasswordApi;
        this._changePasswordApi = value + this._changePasswordApi;
        this._resetPasswordApi = value + this._resetPasswordApi;
        this._manageUserApi = value + this._manageUserApi;
        this.createGuestApi = value + this.createGuestApi;
        this._revokeTokenApi = value + this._revokeTokenApi;
        this._refreshTokenApi = value + this._refreshTokenApi;
    }
}