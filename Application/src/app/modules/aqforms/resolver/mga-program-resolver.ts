
import { Injectable } from '@angular/core';
import { AQUserInfo } from '@agenciiq/login';
import { ProgramService } from '@agenciiq/aqadmin';

@Injectable({
    providedIn: 'root'
})
export class MGAProgramResolver  {
    userId:any = 0;
    programDataMaster;
    constructor(
        private _userInfo: AQUserInfo,
        private _programService: ProgramService,
    ) {
        this.userId = this._userInfo.UserId();
    }
    resolve() {
       return this._programService.MGAPrograms(this.userId, 1);           
    }
}   