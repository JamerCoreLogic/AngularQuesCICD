import { ILoginResp } from '../interfaces/base-login-resp';

export class LoginResp implements ILoginResp {
    data: any;
    success: boolean;
    message: string

    constructor(resp: ILoginResp) {
        this.success = resp.success;
        this.message = resp.message
    }
}




