import { IManageProgramResp } from '../interface/base-program-resp';

export class ManageProgramResp implements IManageProgramResp {
    data;
    message;
    success;    

    constructor(resp:IManageProgramResp){
        this.data = resp.data;
        this.message = resp.message;
        this.success = resp.success;
    }

}