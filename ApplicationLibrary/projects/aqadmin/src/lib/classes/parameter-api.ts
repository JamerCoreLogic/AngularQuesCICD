import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class ParameterApi {
    private _getParameterApi = '/AQAPI/api/Parameters/GetParameterData';
    private _getAllParameterData = '/AQAPI/api/Parameters/GetAllParameterData';
    private _getZipDetailsApi = '/AQAPI/api/insured/CityStateLookUp';
    private _ValidateAddressApi = '/AQAPI/api/insured/ValidateAddress';
    private _validateAddressFieldApi = '/aqapi/api/Address/ValidateAddress'
    private _MGAProgramsApi = '/AQAPI/api/MGA/GetMGAPrograms';
    private _GetConfigurationApi = '/AQAPI/api/MGA/GetConfiguration';
    private _parameterKeysListApi = "/AQAPI/api/parameters/getparameterkey";
    private _saveParameterApi = "/aqapi/api/parameters/Saveparameterdata";
    private _downloadParameterApi = "/aqapi/api/Parameters/DownloadParameter";
    private _saveParameterDialog = "/aqapi/api/Parameters/SaveParameter";
    private _getParameterScreenApi = "/aqapi/api/Parameters/GetAllParameterData";
    private _getParameterKeyApi = "/aqapi/api/Parameters/SaveParameterKey";


    /* Get API's functions */


    get parameterApi() {
        return this._getParameterApi;
    }

    get zipDetailsApi() {
        return this._getZipDetailsApi;
    }

    get validateAddressApi() {
        return this._ValidateAddressApi;
    }

    get validateAddressFieldApi() {
        return this._validateAddressFieldApi;
    }

    get mgaProgramsApi() {
        return this._MGAProgramsApi;
    }

    get GetConfigurationApi() {
        return this._GetConfigurationApi;
    }

    get ParameterKeysListAPI() {
        return this._parameterKeysListApi;
    }

    get SaveParameterApi() {
        return this._saveParameterApi;
    }

    get DownloadParameterApi() {
        return this._downloadParameterApi;
    }

    get SaveParameterDialog() {
        return this._saveParameterDialog;
    }

    get getAllParameterDataApi() {
        return this._getAllParameterData;
    }
    get parameterScreenApi(){
        return this._getParameterScreenApi;
    }

    get GetParameterKeyApi(){
        return this._getParameterKeyApi;
    }

    /* Set API's Function */

    set parameterApiEndPoint(value) {
        this._getParameterApi = value + this._getParameterApi;
        this._getZipDetailsApi = value + this._getZipDetailsApi;
        this._ValidateAddressApi = value + this._ValidateAddressApi;
        this._validateAddressFieldApi = value + this._validateAddressFieldApi;
        this._MGAProgramsApi = value + this._MGAProgramsApi;
        this._GetConfigurationApi = value + this._GetConfigurationApi;
        this._parameterKeysListApi = value + this._parameterKeysListApi;
        this._saveParameterApi = value + this._saveParameterApi;
        this._downloadParameterApi = value + this._downloadParameterApi;
        this._saveParameterDialog = value + this._saveParameterDialog;
        this._getAllParameterData = value + this._getAllParameterData;
        this._getParameterScreenApi = value + this. _getParameterScreenApi;
        this._getParameterKeyApi = value + this._getParameterKeyApi;
    }

}
