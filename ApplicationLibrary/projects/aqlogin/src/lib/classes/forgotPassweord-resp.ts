import { IBaseForgotPasswordResp } from '../interfaces/base-forgot-password-resp';


export class ForgetPasswordResp implements IBaseForgotPasswordResp  {
    data:any;
    success:boolean;
    message:string;

    constructor(resp:IBaseForgotPasswordResp) {
        this.message = resp.message;
        this.success = resp.success;
    }
}