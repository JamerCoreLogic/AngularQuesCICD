import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class BusinessTransferApi {
    private _agentListApi = '/api/BusinessTransfer/GetAgentsData';
    private _transferApi = '/api/BusinessTransfer/TransferBusiness';


    get agentListApi() {
        return this._agentListApi;
    }

    get transferAPI() {
        return this._transferApi;
    }

    set BusinessApiEndPoint(value) {
        this._agentListApi = value + this._agentListApi;
        this._transferApi = value + this._transferApi;

    }
}
