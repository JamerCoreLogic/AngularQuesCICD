import { IParameterResp, IParameterData } from '../interfaces/base-paramater-req';

export class ParameterResp implements IParameterResp {
    data:any;
    message:any;
    success: any;

    constructor(resp:IParameterResp){
        this.message = resp.message;
        this.success = resp.success;    
    }
}