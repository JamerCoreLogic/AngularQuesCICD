import { IBaseChangePasswordResp } from '../interfaces/base-change-password-resp';

export class ChangePasswordResp implements IBaseChangePasswordResp  {
    data:any;
    success:boolean;
    message:string;

    constructor(resp:IBaseChangePasswordResp) {
        this.message = resp.message;
        this.success = resp.success;
    }
}