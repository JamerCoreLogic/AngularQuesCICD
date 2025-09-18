
import { AQStates, AQParameterService } from '@agenciiq/aqadmin';
import { AQUserInfo } from '@agenciiq/login';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn:'root'
})
export class ParameterResolver  {
    constructor(
        private parameter: AQParameterService,
        private _userInfo: AQUserInfo
    ){

    }
    resolve(){
       return this.parameter.getParameterByKey("FORM TYPE", this._userInfo.UserId())
    }
}