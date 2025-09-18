import { IAgencyProgramList, IAgencyProgramResp, IAgencyProgramData } from '../interfaces/base-agency-program-resp';

export class AgencyProgramList implements IAgencyProgramResp {
    data: IAgencyProgramData = {
        agencyPrograms: []
    };
    success: boolean;
    message: string;

    constructor(resp: IAgencyProgramResp) {
        this.message = resp.message;
        this.success = resp.success;
        this.data.agencyPrograms = resp.data.agencyPrograms;
    }
}