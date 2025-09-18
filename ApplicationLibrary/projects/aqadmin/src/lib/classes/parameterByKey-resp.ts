import { IParameterResp } from '../interfaces/base-paramater-req';

export class ParameterByKeyResp implements IParameterResp {
    data:any;
    message:any;
    success: any;

    constructor(resp:IParameterResp){
        this.data=resp.data
        this.message = resp.message;
        this.success = resp.success;    
    }
}