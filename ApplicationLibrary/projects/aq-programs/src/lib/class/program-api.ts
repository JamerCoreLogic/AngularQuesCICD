import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class ProgramApi {
        SavePrograms
    private _getProgramApi = '/api/AQForms/GetPrograms';
    private _getAqProgram = '/api/aqprogramsforms/GetAQProgramsForms';
    private _saveAqProgramApi = '/api/aqprogramsforms/SavePrograms';
    private _getProgramByIDApi = '/api/aqprogramsforms/GetProgramByID ';

    /* Get API's functions */

    get programApi() {
        return this._getProgramApi;
    }

    get AQProgramApi() {
        return this._getAqProgram;
    }

    get saveAQProgramApi() {
        return this._saveAqProgramApi;
    }

    get GetProgramByIDApi() {
        return this._getProgramByIDApi;
    }

    /* Set API's Function */

    set programApiEndPoint(value) {
        this._getProgramApi = value + this._getProgramApi;
        this._getAqProgram = value + this._getAqProgram;
        this._saveAqProgramApi = value + this._saveAqProgramApi;
        this._getProgramByIDApi = value + this._getProgramByIDApi
    }

}
