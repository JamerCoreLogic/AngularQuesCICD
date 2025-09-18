import { ICreateAgencyResp } from '../interfaces/base-create-agency-resp';

export class CreateAgencyResposeModel implements ICreateAgencyResp {
    data: null;
    success: boolean;
    message: string;

    constructor(resp: ICreateAgencyResp) {
        this.message = resp.message;
        this.success = resp.success;
    }
}