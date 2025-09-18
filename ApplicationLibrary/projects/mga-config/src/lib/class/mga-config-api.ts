import { Injectable } from '@angular/core';

@Injectable({
    providedIn:'root'
})
export class MGAConfgApi {
    private _mgaConfigApi = "/AQAPI/api/MGA/GetMGAConfiguration";
    private _saveMgaConfigApi = "/AQAPI/api/MGA/SaveMGAConfiguration";

    get MGACongiApi() {
        return this._mgaConfigApi;
    }

    get SaveMgaConfigApi(){
        return this._saveMgaConfigApi;
    }

    set MGAConfigApiEndPoint(value) {
        this._mgaConfigApi = value + this._mgaConfigApi;
        this._saveMgaConfigApi = value + this._saveMgaConfigApi;
    }
}