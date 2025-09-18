import { Injectable } from '@angular/core';
import { IUser } from '../../../interfaces/base-login-resp';

@Injectable({
    providedIn: 'root'
})
export class AQUserInfo {

    constructor() { }

    private userInfo():IUser {
        return JSON.parse(sessionStorage.getItem('user'));
    }

    UserId() {
        return this.userInfo() ? this.userInfo().userId : 0;
    }

    UserName() {
        return this.userInfo() ? this.userInfo().userName : null;
    }

    isResetPassword() {
        return this.userInfo() ? this.userInfo().resetPassword : null
    }

    isNewUser() {
        return this.userInfo() ? this.userInfo().newUser : null
    }

    getToken():string {
        return this.userInfo() && this.userInfo().token ? this.userInfo().token : null;
    }

    getRefreshToken():string {
        return this.userInfo() && this.userInfo().refreshToken ? this.userInfo().refreshToken : null;
    }
}
