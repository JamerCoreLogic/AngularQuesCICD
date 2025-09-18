import { IAQFormsResp, IAQFormsData } from '../interfaces/base-aq-forms';

export class AQForms implements IAQFormsResp {

    data: IAQFormsData = {
        aQFormResponses: []
    };
    success: boolean;
    message: string;

    constructor(resp: IAQFormsResp) {
        this.message = resp.message;
        this.success = resp.success;
        this.data.aQFormResponses = resp.data.aQFormResponses;
    }
}