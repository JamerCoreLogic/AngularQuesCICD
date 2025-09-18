import { IRememberPasswordResp } from '../interfaces/base-reset-password-resp';


export class ResetPasswordResp implements IRememberPasswordResp  {
    data:any;
    success:boolean;
    message:string;

    constructor(resp: IRememberPasswordResp) {
        this.message = resp.message;
        this.success = resp.success;
    }
}