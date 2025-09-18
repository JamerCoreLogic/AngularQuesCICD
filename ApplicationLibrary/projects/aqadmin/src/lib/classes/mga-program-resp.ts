import { IMGAProgramsResp, IMGAProgramsData, IMgaProgramList } from '../interfaces/base-mga-programs-resp';
import { MGAProgram } from './mga-program';

export class MGAProgramsResp implements IMGAProgramsResp {
    data: IMGAProgramsData = {
        mgaProgramList : []
    };
    message: any;
    success: any;

    constructor(resp: IMGAProgramsResp) {
        this.message = resp.message;
        this.success = resp.success;
        this.data.mgaProgramList =  resp.data.mgaProgramList; /* this.filterProgramsData(resp.data.programLob) */;
    }

   
}