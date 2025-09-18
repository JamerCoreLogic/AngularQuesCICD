import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class AQFormsApi {
    private _formsListApi = '/api/AQForms/GetAQForm';
    private _formsGetApi = '/api/AQForms/GetAQFormById';
    //private _formsCreateApi = '/api/AQForms/SaveAQForms';
    private _formsCreateApi = '/api/AQForms/SaveAQFormsExcel';
    private _getFormsNewApi = '/api/AQForms/GetForms';
    private _formsExcelUploadApi = 'http://fb.spectraltech.ai/dev/api/api/aqform/UploadAQFile';
    private _downloadExcelFileApi = '/api/AQForms/GetExcelFormDownload';
    private _getAQFormList = '/api/AQForms/GetAQFormList';

    //api/AQForms/GetExcelFormDownload
    get getFormsNewApi() {
        return this._getFormsNewApi
    }

    get formsListApi() {
        return this._formsListApi;
    }

    get formsGetApi() {
        return this._formsGetApi;
    }

    get formsExcelUploadApi() {
        return this._formsExcelUploadApi;
    }

    get formsCreateApi() {
        return this._formsCreateApi;
    }

    get downloadExcelFile() {
        return this._downloadExcelFileApi;
    }

    get getAQFormList() {
        return this._getAQFormList;
    }


    set formsListApiEndPoint(value) {
        this._formsListApi = value + this._formsListApi;
        this._formsGetApi = value + this.formsGetApi;
        this._formsCreateApi = value + this._formsCreateApi;
        this._getFormsNewApi = value + this._getFormsNewApi;
        this._downloadExcelFileApi = value + this._downloadExcelFileApi;
        this._getAQFormList = value + this._getAQFormList;

    }
}
