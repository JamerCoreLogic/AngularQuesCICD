import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class AgencyApi {
    private _getAgencyListApi = '/AQAPI/api/Agency/GetAgencyList';
    private _getNewAgencyListApi = '/AQAPI/api/Agency/GetAgencyListNEW';
    private _getAgencyDetailApi = '/AQAPI/api/Agency/GetAgencyDetail';
    private _createAgencyApi = '/AQAPI/api/agency/AddAgency';
    private _updateBranchApi = '/AQAPI/api/Agency/SaveBranch';
    private _getProgramListApi = '/AQAPI/api/Agency/GetAgencyPrograms';

    /* Get API's functions */


    get agencyListApi() {
        return this._getAgencyListApi;
    }

    get newAgencyListApi() {
        return this._getNewAgencyListApi;
    }

    get agencyDetailApi() {
        return this._getAgencyDetailApi;
    }

    get createAgencyApi() {
        return this._createAgencyApi;
    }

    get updateBranchApi() {
        return this._updateBranchApi;
    }

    get getProgramListApi(){
        return this._getProgramListApi;
    }

    set agencyListApiEndPoint(value) {
        this._getAgencyListApi = value + this._getAgencyListApi;
        this._getNewAgencyListApi = value + this._getNewAgencyListApi;
        this._getAgencyDetailApi = value + this._getAgencyDetailApi;
        this._createAgencyApi = value + this._createAgencyApi;
        this._updateBranchApi = value + this._updateBranchApi;
        this._getProgramListApi = value + this._getProgramListApi;
    }

}
