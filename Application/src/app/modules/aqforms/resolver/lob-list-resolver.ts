
import { Injectable } from '@angular/core';
import { LOBService, ILOBGetRequest } from '@agenciiq/quotes';
import { AQUserInfo } from '@agenciiq/login';

@Injectable({
    providedIn: 'root'
})
export class LOBListResolver  {
    constructor(
        private LOBService: LOBService,
        private _userInfo: AQUserInfo
    ) {

    }
    resolve() {
        return this.LOBService.GetLOBList(this._userInfo.UserId());
    }
}